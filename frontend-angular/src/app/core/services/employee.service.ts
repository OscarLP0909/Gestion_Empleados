import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

const API_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${API_URL}/employee`);
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${API_URL}/employee/${id}`);
  }

  getByNif(nif: string): Observable<Employee> {
    return this.http.get<Employee>(`${API_URL}/employee/nif/${nif}`);
  }

  create(employee: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(`${API_URL}/employee`, employee);
  }

  update(id: string, employee: Partial<Employee>): Observable<Employee> {
    return this.http.put<Employee>(`${API_URL}/employee/${id}`, employee);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${API_URL}/employee/${id}`);
  }
}
