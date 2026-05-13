import type { Request, Response, NextFunction } from 'express';
import { authorizeRole, isHROrAdmin, isAdmin } from '../../middlewares/authorization';

const makeReq = (user?: any) => ({ user } as unknown as Request);
const makeRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const next = () => jest.fn() as unknown as NextFunction;

describe('authorizeRole', () => {
  it('retorna 401 si no hay usuario en la request', () => {
    const res = makeRes();
    const n = next();
    authorizeRole(['ADMIN'])(makeReq(undefined), res, n);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(n).not.toHaveBeenCalled();
  });

  it('retorna 403 si el rol del usuario no está en la lista permitida', () => {
    const res = makeRes();
    const n = next();
    authorizeRole(['ADMIN', 'HR_MANAGER'])(makeReq({ role: 'EMPLOYEE' }), res, n);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(n).not.toHaveBeenCalled();
  });

  it('llama a next si el rol está permitido', () => {
    const res = makeRes();
    const n = next();
    authorizeRole(['ADMIN', 'MANAGER'])(makeReq({ role: 'MANAGER' }), res, n);
    expect(n).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('el mensaje de 403 incluye el rol del usuario', () => {
    const res = makeRes();
    authorizeRole(['ADMIN'])(makeReq({ role: 'EMPLOYEE' }), res, next());
    const msg: string = (res.json as jest.Mock).mock.calls[0][0].message;
    expect(msg).toContain('EMPLOYEE');
    expect(msg).toContain('ADMIN');
  });
});

describe('isHROrAdmin', () => {
  it('retorna 401 si no hay usuario', () => {
    const res = makeRes();
    isHROrAdmin(makeReq(undefined), res, next());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('retorna 403 para el rol EMPLOYEE', () => {
    const res = makeRes();
    isHROrAdmin(makeReq({ role: 'EMPLOYEE' }), res, next());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('retorna 403 para el rol MANAGER', () => {
    const res = makeRes();
    isHROrAdmin(makeReq({ role: 'MANAGER' }), res, next());
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('llama a next para ADMIN', () => {
    const n = next();
    isHROrAdmin(makeReq({ role: 'ADMIN' }), makeRes(), n);
    expect(n).toHaveBeenCalled();
  });

  it('llama a next para HR_MANAGER', () => {
    const n = next();
    isHROrAdmin(makeReq({ role: 'HR_MANAGER' }), makeRes(), n);
    expect(n).toHaveBeenCalled();
  });
});

describe('isAdmin', () => {
  it('retorna 401 si no hay usuario', () => {
    const res = makeRes();
    isAdmin(makeReq(undefined), res, next());
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('retorna 403 para rol no-ADMIN', () => {
    for (const role of ['HR_MANAGER', 'MANAGER', 'EMPLOYEE']) {
      const res = makeRes();
      isAdmin(makeReq({ role }), res, next());
      expect(res.status).toHaveBeenCalledWith(403);
    }
  });

  it('llama a next para ADMIN', () => {
    const n = next();
    isAdmin(makeReq({ role: 'ADMIN' }), makeRes(), n);
    expect(n).toHaveBeenCalled();
  });
});
