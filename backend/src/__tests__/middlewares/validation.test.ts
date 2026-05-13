import type { Request, Response, NextFunction } from 'express';
import { validateObjectId } from '../../middlewares/validation';

const makeReq = (params: Record<string, string>) =>
  ({ params } as unknown as Request);

const makeRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('validateObjectId', () => {
  it('llama a next con un ObjectId válido', () => {
    const req = makeReq({ id: '507f1f77bcf86cd799439011' });
    const res = makeRes();
    const next = jest.fn() as unknown as NextFunction;
    validateObjectId('id')(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('retorna 400 si el formato del ObjectId es inválido', () => {
    const req = makeReq({ id: 'not-a-valid-id' });
    const res = makeRes();
    const next = jest.fn() as unknown as NextFunction;
    validateObjectId('id')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect((res.json as jest.Mock).mock.calls[0][0]).toMatchObject({
      message: 'Invalid id format',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('retorna 400 si el id está vacío', () => {
    const req = makeReq({ id: '' });
    const res = makeRes();
    const next = jest.fn() as unknown as NextFunction;
    validateObjectId('id')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('usa el nombre del parámetro personalizado en el mensaje de error', () => {
    const req = makeReq({ employeeId: 'bad-id' });
    const res = makeRes();
    const next = jest.fn() as unknown as NextFunction;
    validateObjectId('employeeId')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    const msg: string = (res.json as jest.Mock).mock.calls[0][0].message;
    expect(msg).toContain('employeeId');
  });
});
