import type { Request } from 'express';

// --- mocks -----------------------------------------------------------

const mockAuditSave = jest.fn().mockResolvedValue(undefined);
const mockAuditInstance = { save: mockAuditSave };

const mockChain = {
  populate: jest.fn(),
  sort: jest.fn(),
  skip: jest.fn(),
  limit: jest.fn(),
  lean: jest.fn(),
};

// Encadenar los métodos para que devuelvan el mismo objeto
mockChain.populate.mockReturnValue(mockChain);
mockChain.sort.mockReturnValue(mockChain);
mockChain.skip.mockReturnValue(mockChain);
mockChain.limit.mockReturnValue(mockChain);
mockChain.lean.mockResolvedValue([]);

jest.mock('../../db/models/AuditLog.js', () => {
  const MockAuditLog = jest.fn().mockImplementation(() => mockAuditInstance);
  MockAuditLog.find = jest.fn();
  MockAuditLog.countDocuments = jest.fn();
  return { AuditLog: MockAuditLog };
});

// --- imports ---------------------------------------------------------

import { AuditLog } from '../../db/models/AuditLog.js';
import { createAuditLog, getAuditLogs } from '../../services/auditService';

// --- helpers ---------------------------------------------------------

const MockAuditLog = AuditLog as unknown as {
  find: jest.Mock;
  countDocuments: jest.Mock;
};

const fakeReq = {
  ip: '127.0.0.1',
  connection: { remoteAddress: '127.0.0.1' },
  get: jest.fn().mockReturnValue('test-agent'),
} as unknown as Request;

// --- tests -----------------------------------------------------------

describe('createAuditLog', () => {
  it('crea y guarda un log de auditoría', async () => {
    await createAuditLog(
      'user-id',
      'Admin',
      'CREATE',
      'EMPLOYEE',
      'entity-id',
      'Juan García',
      fakeReq,
      { after: { name: 'Juan' } },
      'Empleado creado',
    );
    expect(mockAuditSave).toHaveBeenCalled();
  });

  it('no lanza error si guardar falla (lo captura internamente)', async () => {
    mockAuditSave.mockRejectedValueOnce(new Error('DB error'));
    await expect(
      createAuditLog('uid', 'Name', 'DELETE', 'CONTRACT', 'eid', 'pos', fakeReq),
    ).resolves.not.toThrow();
  });
});

describe('getAuditLogs', () => {
  beforeEach(() => {
    MockAuditLog.find.mockReturnValue(mockChain);
    MockAuditLog.countDocuments.mockResolvedValue(0);
    mockChain.lean.mockResolvedValue([]);
  });

  it('devuelve la estructura de paginación correcta', async () => {
    MockAuditLog.countDocuments.mockResolvedValue(5);
    mockChain.lean.mockResolvedValue([{ action: 'CREATE' }]);
    const result = await getAuditLogs(1, 5);
    expect(result).toEqual({
      logs: [{ action: 'CREATE' }],
      total: 5,
      page: 1,
      pages: 1,
    });
  });

  it('calcula páginas correctamente', async () => {
    MockAuditLog.countDocuments.mockResolvedValue(25);
    mockChain.lean.mockResolvedValue([]);
    const result = await getAuditLogs(1, 10);
    expect(result.pages).toBe(3);
  });

  it('aplica filtro de userId cuando se proporciona', async () => {
    await getAuditLogs(1, 20, { userId: 'uid-123' });
    expect(MockAuditLog.find).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'uid-123' }),
    );
  });

  it('aplica filtro de action cuando se proporciona', async () => {
    await getAuditLogs(1, 20, { action: 'DELETE' });
    expect(MockAuditLog.find).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'DELETE' }),
    );
  });

  it('aplica filtro de rango de fechas', async () => {
    const start = new Date('2025-01-01');
    const end = new Date('2025-12-31');
    await getAuditLogs(1, 20, { startDate: start, endDate: end });
    expect(MockAuditLog.find).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: { $gte: start, $lte: end },
      }),
    );
  });

  it('usa la página y el límite para calcular el skip', async () => {
    await getAuditLogs(3, 10);
    expect(mockChain.skip).toHaveBeenCalledWith(20);
    expect(mockChain.limit).toHaveBeenCalledWith(10);
  });
});
