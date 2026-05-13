import '@angular/compiler';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { of } from 'rxjs';
import { EmployeeService } from './employee.service';
import type { Employee } from '../models/employee.model';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
afterEach(() => getTestBed().resetTestingModule());

const mockHttp = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

const mockEmployee: Employee = {
  _id: 'emp-id-1',
  name: 'Juan',
  surname: 'García',
  nif: '12345678A',
  email: 'juan@example.com',
  phone: '600000000',
  city: 'Madrid',
  province: 'Madrid',
  country: 'España',
};

describe('EmployeeService', () => {
  let service: EmployeeService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new EmployeeService(mockHttp as any);
  });

  describe('getAll', () => {
    it('realiza GET a /employee y mapea la respuesta', () => {
      mockHttp.get.mockReturnValue(of([{ ...mockEmployee, id: 'emp-id-1' }]));

      let result: Employee[] = [];
      service.getAll().subscribe(data => (result = data));

      expect(mockHttp.get).toHaveBeenCalledWith(expect.stringContaining('/employee'));
      expect(result[0]._id).toBe('emp-id-1');
    });

    it('mapea _id desde id si _id no existe', () => {
      const employeeWithId = { name: 'Ana', id: 'id-from-backend' };
      mockHttp.get.mockReturnValue(of([employeeWithId]));

      let result: Employee[] = [];
      service.getAll().subscribe(data => (result = data));

      expect(result[0]._id).toBe('id-from-backend');
    });
  });

  describe('getById', () => {
    it('realiza GET a /employee/:id', () => {
      mockHttp.get.mockReturnValue(of(mockEmployee));

      service.getById('emp-id-1').subscribe();

      expect(mockHttp.get).toHaveBeenCalledWith(expect.stringContaining('/employee/emp-id-1'));
    });

    it('devuelve el empleado mapeado', () => {
      mockHttp.get.mockReturnValue(of({ ...mockEmployee, id: 'emp-id-1', _id: undefined }));

      let result: Employee | null = null;
      service.getById('emp-id-1').subscribe(e => (result = e));

      expect(result!._id).toBe('emp-id-1');
    });
  });

  describe('getByNif', () => {
    it('realiza GET a /employee/nif/:nif', () => {
      mockHttp.get.mockReturnValue(of(mockEmployee));

      service.getByNif('12345678A').subscribe();

      expect(mockHttp.get).toHaveBeenCalledWith(
        expect.stringContaining('/employee/nif/12345678A'),
      );
    });
  });

  describe('create', () => {
    it('realiza POST a /employee con los datos del empleado', () => {
      mockHttp.post.mockReturnValue(of(mockEmployee));

      service.create({ name: 'Juan', nif: '12345678A' }).subscribe();

      expect(mockHttp.post).toHaveBeenCalledWith(
        expect.stringContaining('/employee'),
        { name: 'Juan', nif: '12345678A' },
      );
    });
  });

  describe('update', () => {
    it('realiza PUT a /employee/:id', () => {
      const updated = { ...mockEmployee, name: 'Pedro' };
      mockHttp.put.mockReturnValue(of(updated));

      service.update('emp-id-1', { name: 'Pedro' }).subscribe();

      expect(mockHttp.put).toHaveBeenCalledWith(
        expect.stringContaining('/employee/emp-id-1'),
        { name: 'Pedro' },
      );
    });
  });

  describe('delete', () => {
    it('realiza DELETE a /employee/:id', () => {
      mockHttp.delete.mockReturnValue(of({ message: 'deleted' }));

      service.delete('emp-id-1').subscribe();

      expect(mockHttp.delete).toHaveBeenCalledWith(
        expect.stringContaining('/employee/emp-id-1'),
      );
    });
  });
});
