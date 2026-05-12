import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthUser, UserRole } from '../models/user.model';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AuthUser | null>(this.loadFromStorage());

  user = this._user.asReadonly();
  isAuthenticated = computed(() => !!this._user());
  userRole = computed(() => this._user()?.role);
  isAdmin = computed(() => this._user()?.role === 'ADMIN');
  isHrManager = computed(() => ['ADMIN', 'HR_MANAGER'].includes(this._user()?.role ?? ''));

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${API_URL}/auth/login`, { email, password }).pipe(
      tap(res => {
        const { token, password, ...userData } = res;
        const user: AuthUser = { ...userData, token };
        this._user.set(user);
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('token', token);
      })
    );
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  updateProfile(data: Partial<AuthUser>): Observable<any> {
    return this.http.patch<any>(`${API_URL}/auth/profile`, data).pipe(
      tap(res => {
        const current = this._user();
        if (current) {
          const updated = { ...current, ...res };
          this._user.set(updated);
          localStorage.setItem('auth_user', JSON.stringify(updated));
        }
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(`${API_URL}/auth/change-password`, { currentPassword, newPassword });
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${API_URL}/auth/profile`);
  }

  private loadFromStorage(): AuthUser | null {
    try {
      const data = localStorage.getItem('auth_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  hasRole(...roles: UserRole[]): boolean {
    const role = this._user()?.role;
    return role ? roles.includes(role) : false;
  }
}
