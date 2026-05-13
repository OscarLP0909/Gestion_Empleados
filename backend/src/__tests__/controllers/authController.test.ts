import type { Request, Response, NextFunction } from 'express';

// --- mocks -----------------------------------------------------------

const mockSave = jest.fn().mockResolvedValue(undefined);
const mockUserInstance = {
  _id: 'user-id-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'EMPLOYEE',
  isActive: true,
  password: 'hashed',
  comparePassword: jest.fn(),
  save: mockSave,
};

jest.mock('../../db/models/user.js', () => {
  const MockUser = jest.fn().mockImplementation(() => mockUserInstance);
  MockUser.findOne = jest.fn();
  MockUser.findById = jest.fn();
  MockUser.findByIdAndUpdate = jest.fn();
  return { User: MockUser };
});

jest.mock('../../middlewares/auth/local.js', () => ({
  localStrategy: { name: 'local', strategy: { name: 'local' } },
}));

jest.mock('../../middlewares/auth/jwt.js', () => ({
  jwtStrategy: { name: 'jwt', strategy: { name: 'jwt' } },
  withToken: jest.fn((u) => ({ ...u, token: 'mock-token' })),
}));

jest.mock('passport', () => ({
  use: jest.fn(),
  authenticate: jest.fn(),
}));

// --- imports ---------------------------------------------------------

import { User } from '../../db/models/user.js';
import { register, getProfile, updateProfile, changePassword } from '../../controllers/authController';

// --- helpers ---------------------------------------------------------

const MockUser = User as unknown as {
  findOne: jest.Mock;
  findById: jest.Mock;
  findByIdAndUpdate: jest.Mock;
};

const makeReq = (overrides: Partial<Request> = {}): Request =>
  ({
    body: {},
    params: {},
    user: { _id: 'user-id-123', name: 'Test', role: 'EMPLOYEE' },
    ...overrides,
  } as unknown as Request);

const makeRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const noop = jest.fn() as unknown as NextFunction;

// --- tests -----------------------------------------------------------

describe('register', () => {
  it('retorna 400 si faltan campos obligatorios', async () => {
    const res = makeRes();
    await register(makeReq({ body: { email: 'a@a.com' } }), res, noop);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retorna 400 si el usuario ya existe', async () => {
    MockUser.findOne.mockResolvedValue({ email: 'test@example.com' });
    const res = makeRes();
    await register(
      makeReq({ body: { email: 'test@example.com', password: '123', name: 'Juan' } }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect((res.json as jest.Mock).mock.calls[0][0].message).toContain('ya existe');
  });

  it('registra el usuario y retorna 201', async () => {
    MockUser.findOne.mockResolvedValue(null);
    mockSave.mockResolvedValue(undefined);
    const res = makeRes();
    await register(
      makeReq({ body: { email: 'nuevo@example.com', password: 'pass123', name: 'Nuevo' } }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    const body = (res.json as jest.Mock).mock.calls[0][0];
    expect(body).toHaveProperty('user');
    expect(body.user.email).toBe('test@example.com');
  });

  it('llama a next si ocurre un error', async () => {
    MockUser.findOne.mockRejectedValue(new Error('DB error'));
    const next = jest.fn() as unknown as NextFunction;
    await register(
      makeReq({ body: { email: 'a@a.com', password: '123', name: 'A' } }),
      makeRes(),
      next,
    );
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('getProfile', () => {
  it('retorna 200 con el usuario encontrado', async () => {
    const user = { _id: 'user-id-123', email: 'test@example.com', name: 'Test' };
    MockUser.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });
    const res = makeRes();
    await getProfile(makeReq(), res, noop);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('retorna 404 si el usuario no existe', async () => {
    MockUser.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    const res = makeRes();
    await getProfile(makeReq(), res, noop);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('updateProfile', () => {
  it('retorna 400 si no se envía ningún campo', async () => {
    const res = makeRes();
    await updateProfile(makeReq({ body: {} }), res, noop);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('actualiza el perfil y retorna 200', async () => {
    const updated = { name: 'Nuevo nombre', email: 'nuevo@example.com' };
    MockUser.findByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue(updated) });
    const res = makeRes();
    await updateProfile(makeReq({ body: { name: 'Nuevo nombre' } }), res, noop);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });
});

describe('changePassword', () => {
  it('retorna 400 si faltan contraseñas', async () => {
    const res = makeRes();
    await changePassword(makeReq({ body: { currentPassword: '123' } }), res, noop);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retorna 404 si el usuario no existe', async () => {
    MockUser.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    const res = makeRes();
    await changePassword(
      makeReq({ body: { currentPassword: 'old', newPassword: 'new' } }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retorna 401 si la contraseña actual es incorrecta', async () => {
    const userWithCompare = { ...mockUserInstance, comparePassword: jest.fn().mockResolvedValue(false) };
    MockUser.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(userWithCompare) });
    const res = makeRes();
    await changePassword(
      makeReq({ body: { currentPassword: 'wrong', newPassword: 'new' } }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('cambia la contraseña y retorna 200', async () => {
    const userWithSave = {
      ...mockUserInstance,
      comparePassword: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(undefined),
    };
    MockUser.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(userWithSave) });
    const res = makeRes();
    await changePassword(
      makeReq({ body: { currentPassword: 'current', newPassword: 'new123' } }),
      res,
      noop,
    );
    expect(userWithSave.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
