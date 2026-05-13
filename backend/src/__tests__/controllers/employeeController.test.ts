import type { Request, Response, NextFunction } from 'express';

// --- mocks -----------------------------------------------------------

jest.mock('../../db/models/Employee.js', () => {
  const instance = {
    _id: { toString: () => 'emp-id-123' },
    name: 'Juan',
    surname: 'García',
    nif: '12345678A',
    email: 'juan@example.com',
    save: jest.fn().mockResolvedValue(undefined),
    toObject: jest.fn().mockReturnValue({ name: 'Juan', surname: 'García' }),
  };
  const MockEmployee = jest.fn().mockImplementation(() => instance);
  MockEmployee.findOne = jest.fn();
  MockEmployee.find = jest.fn();
  MockEmployee.findById = jest.fn();
  MockEmployee.findByIdAndUpdate = jest.fn();
  MockEmployee.findByIdAndDelete = jest.fn();
  return { Employee: MockEmployee };
});

jest.mock('../../services/auditService.js', () => ({
  createAuditLog: jest.fn().mockResolvedValue(undefined),
}));

// --- imports después de los mocks ------------------------------------

import { Employee } from '../../db/models/Employee.js';
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeeByNif,
  updateEmployee,
  deleteEmployee,
} from '../../controllers/employeeController';

// --- helpers ---------------------------------------------------------

const baseUser = { _id: { toString: () => 'user-id-1' }, name: 'Admin' };

const makeReq = (overrides: Partial<Request> = {}): Request =>
  ({
    body: {},
    params: {},
    user: baseUser,
    ip: '127.0.0.1',
    connection: { remoteAddress: '127.0.0.1' },
    get: jest.fn().mockReturnValue('test-agent'),
    ...overrides,
  } as unknown as Request);

const makeRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const noop = jest.fn() as unknown as NextFunction;

const MockEmployee = Employee as unknown as {
  findOne: jest.Mock;
  find: jest.Mock;
  findById: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  findByIdAndDelete: jest.Mock;
};

const validBody = {
  name: 'Juan',
  surname: 'García',
  nif: '12345678A',
  email: 'juan@example.com',
  phone: '600000000',
  city: 'Madrid',
  province: 'Madrid',
  country: 'España',
};

// --- tests -----------------------------------------------------------

describe('createEmployee', () => {
  it('crea un empleado y devuelve 201', async () => {
    MockEmployee.findOne.mockResolvedValue(null);
    const res = makeRes();
    await createEmployee(makeReq({ body: validBody }), res, noop);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('retorna 400 si los campos obligatorios tienen tipos inválidos', async () => {
    const res = makeRes();
    await createEmployee(
      makeReq({ body: { name: 123, surname: '', nif: 'A', email: 'e@e.com' } }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retorna 400 si name está vacío', async () => {
    const res = makeRes();
    await createEmployee(
      makeReq({ body: { ...validBody, name: '   ' } }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retorna 409 si ya existe un empleado con ese email o NIF', async () => {
    MockEmployee.findOne.mockResolvedValue({ _id: 'existing-id' });
    const res = makeRes();
    await createEmployee(makeReq({ body: validBody }), res, noop);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('llama a next si ocurre un error inesperado', async () => {
    MockEmployee.findOne.mockRejectedValue(new Error('DB error'));
    const next = jest.fn() as unknown as NextFunction;
    await createEmployee(makeReq({ body: validBody }), makeRes(), next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe('getEmployees', () => {
  it('retorna 200 con la lista de empleados', async () => {
    const employees = [{ name: 'Juan' }, { name: 'Ana' }];
    MockEmployee.find.mockResolvedValue(employees);
    const res = makeRes();
    await getEmployees(makeReq(), res, noop);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(employees);
  });

  it('llama a next si ocurre un error', async () => {
    MockEmployee.find.mockRejectedValue(new Error('DB error'));
    const next = jest.fn() as unknown as NextFunction;
    await getEmployees(makeReq(), makeRes(), next);
    expect(next).toHaveBeenCalled();
  });
});

describe('getEmployeeById', () => {
  const id = '507f1f77bcf86cd799439011';

  it('retorna 200 con el empleado encontrado', async () => {
    const employee = { _id: id, name: 'Juan' };
    MockEmployee.findById.mockResolvedValue(employee);
    const res = makeRes();
    await getEmployeeById(makeReq({ params: { id } as any }), res, noop);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(employee);
  });

  it('retorna 404 si no existe el empleado', async () => {
    MockEmployee.findById.mockResolvedValue(null);
    const res = makeRes();
    await getEmployeeById(makeReq({ params: { id } as any }), res, noop);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('getEmployeeByNif', () => {
  it('retorna 200 con el empleado encontrado por NIF', async () => {
    const employee = { nif: '12345678A' };
    MockEmployee.findOne.mockResolvedValue(employee);
    const res = makeRes();
    await getEmployeeByNif(makeReq({ params: { nif: '12345678A' } as any }), res, noop);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retorna 400 si el NIF está vacío', async () => {
    const res = makeRes();
    await getEmployeeByNif(makeReq({ params: { nif: '' } as any }), res, noop);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('retorna 404 si no existe el empleado', async () => {
    MockEmployee.findOne.mockResolvedValue(null);
    const res = makeRes();
    await getEmployeeByNif(makeReq({ params: { nif: '99999999Z' } as any }), res, noop);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('updateEmployee', () => {
  const id = '507f1f77bcf86cd799439011';
  const existing = {
    _id: { toString: () => id },
    name: 'Juan',
    surname: 'García',
    toObject: jest.fn().mockReturnValue({ name: 'Juan' }),
  };
  const updated = { _id: { toString: () => id }, name: 'Pedro', surname: 'García' };

  it('actualiza el empleado y retorna 200', async () => {
    MockEmployee.findById.mockResolvedValue(existing);
    MockEmployee.findOne.mockResolvedValue(null);
    MockEmployee.findByIdAndUpdate.mockResolvedValue(updated);
    const res = makeRes();
    await updateEmployee(
      makeReq({ params: { id } as any, body: { name: 'Pedro' } }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('retorna 404 si el empleado no existe', async () => {
    MockEmployee.findById.mockResolvedValue(null);
    const res = makeRes();
    await updateEmployee(makeReq({ params: { id } as any, body: {} }), res, noop);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('retorna 409 si el email o NIF ya están en uso', async () => {
    MockEmployee.findById.mockResolvedValue(existing);
    MockEmployee.findOne.mockResolvedValue({ _id: 'otro-id' });
    const res = makeRes();
    await updateEmployee(
      makeReq({ params: { id } as any, body: { email: 'otro@example.com' } }),
      res,
      noop,
    );
    expect(res.status).toHaveBeenCalledWith(409);
  });
});

describe('deleteEmployee', () => {
  const id = '507f1f77bcf86cd799439011';
  const existing = {
    _id: { toString: () => id },
    name: 'Juan',
    surname: 'García',
    toObject: jest.fn().mockReturnValue({}),
  };

  it('elimina el empleado y retorna 200', async () => {
    MockEmployee.findById.mockResolvedValue(existing);
    MockEmployee.findByIdAndDelete.mockResolvedValue(existing);
    const res = makeRes();
    await deleteEmployee(makeReq({ params: { id } as any }), res, noop);
    expect(MockEmployee.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('retorna 404 si el empleado no existe', async () => {
    MockEmployee.findById.mockResolvedValue(null);
    const res = makeRes();
    await deleteEmployee(makeReq({ params: { id } as any }), res, noop);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
