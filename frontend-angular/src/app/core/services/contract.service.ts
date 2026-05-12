import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contract, ContractStatus } from '../models/contract.model';

const API_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ContractService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Contract[]> {
    return this.http.get<any[]>(`${API_URL}/contract`).pipe(map(cs => cs.map(this.mapContract)));
  }

  getById(id: string): Observable<Contract> {
    return this.http.get<any>(`${API_URL}/contract/${id}`).pipe(map(this.mapContract));
  }

  private mapContract(c: any): Contract {
    const emp = c.employeeId && typeof c.employeeId === 'object' ? c.employeeId : null;
    return {
      ...c,
      employeeId: emp ? (emp._id ?? emp.id ?? c.employeeId) : c.employeeId,
      employee: emp ? { name: emp.name, surname: emp.surname, nif: emp.nif, email: emp.email } : c.employee
    };
  }

  getByEmployeeId(employeeId: string): Observable<Contract[]> {
    return this.http.get<any[]>(`${API_URL}/contract/employee/${employeeId}`).pipe(map(cs => cs.map(this.mapContract)));
  }

  getActiveByEmployee(employeeId: string): Observable<Contract> {
    return this.http.get<Contract>(`${API_URL}/contract/employee/active/${employeeId}`);
  }

  getPending(): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${API_URL}/contract/pending`);
  }

  create(contract: Partial<Contract>): Observable<Contract> {
    return this.http.post<Contract>(`${API_URL}/contract`, contract);
  }

  update(id: string, contract: Partial<Contract>): Observable<Contract> {
    return this.http.put<Contract>(`${API_URL}/contract/${id}`, contract);
  }

  updateStatus(id: string, status: ContractStatus): Observable<Contract> {
    return this.http.patch<Contract>(`${API_URL}/contract/${id}`, { status });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/contract/${id}`);
  }
}
