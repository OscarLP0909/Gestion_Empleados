import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';

const API_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/user`);
  }

  create(data: { email: string; password: string; role: UserRole; name?: string }): Observable<User> {
    return this.http.post<User>(`${API_URL}/user`, data);
  }

  updateRole(id: string, role: UserRole): Observable<User> {
    return this.http.patch<User>(`${API_URL}/user/${id}/role`, { role });
  }

  deactivate(id: string): Observable<User> {
    return this.http.patch<User>(`${API_URL}/user/${id}/deactivate`, {});
  }

  activate(id: string): Observable<User> {
    return this.http.patch<User>(`${API_URL}/user/${id}/activate`, {});
  }
}
