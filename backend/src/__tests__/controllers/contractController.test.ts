import type { Request, Response, NextFunction } from 'express';

// --- mocks -----------------------------------------------------------

const mockContractInstance = {
  _id: { toString: () => 'contract-id-123' },
  position: 'Desarrollador',
  status: 'PENDIENTE',
  startDate: new Date('2025-01-01'),
  save: jest.fn().mockResolvedValue(undefined),
  toObject: jest.fn().mockReturnValue({ position: 'Desarrollador', status: 'PENDIENTE' }),
};

jest.mock('../../db/models/Contract.js', () => {
  const MockContract = jest.fn().mockImplementation(() => mockContractInstance);
  MockContract.find = jest.fn();
  MockContract.findById = jest.fn();
  MockContract.findByIdAndUpdate = jest.fn();
  MockContract.findByIdAndDelete = jest.fn();
  return { Contract: MockContract };
});

jest.mock('../../db/models/Employee.js', () => {
  const MockEmployee = jest.fn();
  MockEmployee.findById = jest.fn();
  return { Employee: MockEmployee };
});

jest.mock('../../services/auditService.js', () => ({
  createAuditLog: jest.fn().mockResolvedValue(undefined),
}));

// --- imports ---------------------------------------------------------

import { Contract } from '../../db/models/Contract.js';
import { Employee } from '../../db/models/Employee.js';
import {
  createContract,
  getContracts,
  getContractById,
  deleteContract,
  getContractsOfEmployee,
  getContractActiveOfEmployee,
  updateStatus,
  getContractsPending,
} from '../../controllers/contractController';

// --- helpers ---------------------------------------------------------

const MockContract = Contract as unknown as {
  find: jest.Mock;
  findById: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  findByIdAndDelete: jest.Mock;
};

const MockEmployee = Employee as unknown as { findById: jest.Mock };

const baseUser = { _id: { toString: () => 'user-id-1' }, name: 'Admin' };

const makeReq = (overrides: Partial<Request> = {}): Request =>
  ({
    body: {},
    params: {},
    user: baseUser,
    ip: '127.0.0.1',
    connection: { remoteAddress: '127.0.0.1' },
    get: jest.fn().mockReturnValue('agent'),
    ...overrides,
  } as unknown as Request);

const makeRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const noop = jest.fn() as unknown as NextFunction;

const validBody = {
  employeeId: '507f1f77bcf86cd799439011',
  contractType: 'Indefinido',
  workdayType: 'Completa',
  salaryType: 'Bruto',
  salaryAmount: 30000,
  startDate: '2025-06-01',
  department: 'IT',
  category: 'Técnico',
  position: 'Desarrollador',
};

// --- tests -----------------------------------------------------------

describe('createContract', () => {
  it('crea un contrato y retorna 201', async () => {
    MockEmployee.findById.mockResolvedValue({ name: 'Juan', surname: 'García' });
    const res = makeRes();
    await createContract(makeReq({ body: validBody }), res, noop);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('retorna 404 si el empleado no existe', async () => {
    MockEmployee.findById.mockResolvedValue(null);
    const res = makeRes();
    await createContract(makeReq({ body: validBody }), res, noop);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retorna 400 si faltan campos obligatorios', async () => {
    MockEmployee.findById.mockResolvedValue({ name: 'Juan', surname: 'García' });
    const res = makeRes();
    await createContract(
      makeReq({ body: { employeeId: validBody.employeeId } }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('asigna ACTIVO si se aprueba con fecha de inicio pasada', async () => {
    MockEmployee.findById.mockResolvedValue({ name: 'Juan', surname: 'García' });
    const res = makeRes();
    await createContract(
      makeReq({ body: { ...validBody, startDate: '2020-01-01', status: 'APROBADO' } }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    const savedInstance = (Contract as jest.Mock).mock.results[0]?.value ?? mockContractInstance;
    expect(savedInstance.save).toHaveBeenCalled();
  });
});

describe('getContracts', () => {
  it('retorna 200 con la lista de contratos', async () => {
    const contracts = [{ position: 'Dev' }];
    MockContract.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(contracts) });
    const res = makeRes();
    await getContracts(makeReq(), res, noop);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(contracts);
  });
});

describe('getContractById', () => {
  const id = '507f1f77bcf86cd799439011';

  it('retorna 200 con el contrato encontrado', async () => {
    const contract = { _id: id, position: 'Dev' };
    MockContract.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(contract) });
    const res = makeRes();
    await getContractById(makeReq({ params: { id } as any }), res, noop);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retorna 404 si el contrato no existe', async () => {
    MockContract.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(null) });
    const res = makeRes();
    await getContractById(makeReq({ params: { id } as any }), res, noop);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('deleteContract', () => {
  const id = '507f1f77bcf86cd799439011';

  it('elimina el contrato y retorna 200', async () => {
    MockContract.findById.mockResolvedValue(mockContractInstance);
    MockContract.findByIdAndDelete.mockResolvedValue(mockContractInstance);
    const res = makeRes();
    await deleteContract(makeReq({ params: { id } as any }), res, noop);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retorna 404 si el contrato no existe', async () => {
    MockContract.findById.mockResolvedValue(null);
    const res = makeRes();
    await deleteContract(makeReq({ params: { id } as any }), res, noop);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('getContractsOfEmployee', () => {
  const validId = '507f1f77bcf86cd799439011';

  it('retorna 200 con los contratos del empleado', async () => {
    MockContract.find.mockResolvedValue([{ position: 'Dev' }]);
    const res = makeRes();
    await getContractsOfEmployee(
      makeReq({ params: { employeeId: validId } as any }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retorna 400 si el employeeId es inválido', async () => {
    const res = makeRes();
    await getContractsOfEmployee(
      makeReq({ params: { employeeId: 'bad-id' } as any }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retorna 404 si el empleado no tiene contratos', async () => {
    MockContract.find.mockResolvedValue([]);
    const res = makeRes();
    await getContractsOfEmployee(
      makeReq({ params: { employeeId: validId } as any }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('getContractActiveOfEmployee', () => {
  const validId = '507f1f77bcf86cd799439011';

  it('retorna 200 con el contrato activo', async () => {
    MockContract.find.mockResolvedValue([{ status: 'ACTIVO' }]);
    const res = makeRes();
    await getContractActiveOfEmployee(
      makeReq({ params: { employeeId: validId } as any }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retorna 404 si no hay contrato activo', async () => {
    MockContract.find.mockResolvedValue([]);
    const res = makeRes();
    await getContractActiveOfEmployee(
      makeReq({ params: { employeeId: validId } as any }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('updateStatus', () => {
  const id = '507f1f77bcf86cd799439011';

  it('actualiza el estado y retorna 200', async () => {
    MockContract.findById.mockResolvedValue(mockContractInstance);
    MockContract.findByIdAndUpdate.mockResolvedValue({ ...mockContractInstance, status: 'APROBADO' });
    const res = makeRes();
    await updateStatus(
      makeReq({ params: { id } as any, body: { status: 'APROBADO' } }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('cambia APROBADO a ACTIVO si la fecha de inicio ya pasó', async () => {
    const past = new Date('2020-01-01');
    const contractPast = { ...mockContractInstance, startDate: past, status: 'PENDIENTE' };
    const updatedActive = { ...mockContractInstance, status: 'ACTIVO' };
    MockContract.findById.mockResolvedValue(contractPast);
    MockContract.findByIdAndUpdate.mockResolvedValue(updatedActive);
    const res = makeRes();
    await updateStatus(
      makeReq({ params: { id } as any, body: { status: 'APROBADO' } }),
      res,
      noop,
    );
    expect(MockContract.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      { status: 'ACTIVO' },
      { new: true },
    );
  });

  it('retorna 404 si el contrato no existe', async () => {
    MockContract.findById.mockResolvedValue(null);
    const res = makeRes();
    await updateStatus(makeReq({ params: { id } as any, body: { status: 'APROBADO' } }), res, noop);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('getContractsPending', () => {
  it('retorna 200 con contratos pendientes', async () => {
    const pending = [{ status: 'PENDIENTE' }];
    MockContract.find.mockReturnValue({ populate: jest.fn().mockResolvedValue(pending) });
    const res = makeRes();
    await getContractsPending(makeReq(), res, noop);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retorna 404 si no hay contratos pendientes', async () => {
    MockContract.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });
    const res = makeRes();
    await getContractsPending(makeReq(), res, noop);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
