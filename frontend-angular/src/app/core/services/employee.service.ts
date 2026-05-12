import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../models/employee.model';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private http: HttpClient) {}

  private mapEmployee(e: any): Employee {
    return { ...e, _id: e._id ?? e.id };
  }

  getAll(): Observable<Employee[]> {
    return this.http.get<any[]>(`${API_URL}/employee`).pipe(map(es => es.map(e => this.mapEmployee(e))));
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<any>(`${API_URL}/employee/${id}`).pipe(map(e => this.mapEmployee(e)));
  }

  getByNif(nif: string): Observable<Employee> {
    return this.http.get<any>(`${API_URL}/employee/nif/${nif}`).pipe(map(e => this.mapEmployee(e)));
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
