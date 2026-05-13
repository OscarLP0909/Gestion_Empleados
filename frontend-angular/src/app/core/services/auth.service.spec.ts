import '@angular/compiler';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import type { AuthUser } from '../models/user.model';

// Initialize Angular testing environment first
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

// Angular's platform testing replaces/removes global localStorage.
// Restore it with a functional mock so AuthService can use it.
const lsStore: Record<string, string> = {};
const lsMock: Storage = {
  length: 0,
  key: () => null,
  getItem: (k: string) => lsStore[k] ?? null,
  setItem: (k: string, v: string) => { lsStore[k] = v; },
  removeItem: (k: string) => { delete lsStore[k]; },
  clear: () => { for (const k of Object.keys(lsStore)) delete lsStore[k]; },
};
Object.defineProperty(globalThis, 'localStorage', { value: lsMock, configurable: true, writable: true });

afterEach(() => {
  getTestBed().resetTestingModule();
});

// ------------- mocks -----------------------------------------------

const mockHttp = { post: vi.fn(), get: vi.fn(), patch: vi.fn() };
const mockRouter = { navigate: vi.fn() };

const mockUserResponse: AuthUser = {
  _id: 'user-id-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'EMPLOYEE',
  isActive: true,
  token: 'jwt-token-abc',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    lsMock.clear();
    vi.clearAllMocks();
    service = new AuthService(mockHttp as any, mockRouter as any);
  });

  describe('login', () => {
    it('realiza POST a /auth/login y guarda el usuario en localStorage', () => {
      mockHttp.post.mockReturnValue(of(mockUserResponse));
      service.login('test@example.com', 'password123').subscribe();

      expect(mockHttp.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        { email: 'test@example.com', password: 'password123' },
      );
      expect(lsMock.getItem('token')).toBe('jwt-token-abc');
    });

    it('actualiza la señal de usuario tras el login', () => {
      mockHttp.post.mockReturnValue(of(mockUserResponse));
      service.login('test@example.com', 'password123').subscribe();
      expect(service.isAuthenticated()).toBe(true);
      expect(service.userRole()).toBe('EMPLOYEE');
    });

    it('guarda el objeto de usuario en localStorage', () => {
      mockHttp.post.mockReturnValue(of(mockUserResponse));
      service.login('test@example.com', 'password123').subscribe();
      const stored = JSON.parse(lsMock.getItem('auth_user') ?? '{}');
      expect(stored.email).toBe('test@example.com');
    });
  });

  describe('logout', () => {
    it('limpia localStorage y navega a /login', () => {
      mockHttp.post.mockReturnValue(of(mockUserResponse));
      service.login('test@example.com', 'pass').subscribe();
      service.logout();
      expect(lsMock.getItem('token')).toBeNull();
      expect(lsMock.getItem('auth_user')).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('la señal de usuario queda en null tras logout', () => {
      mockHttp.post.mockReturnValue(of(mockUserResponse));
      service.login('test@example.com', 'pass').subscribe();
      service.logout();
      expect(service.isAuthenticated()).toBe(false);
      expect(service.user()).toBeNull();
    });
  });

  describe('getToken', () => {
    it('devuelve null si no hay token', () => {
      expect(service.getToken()).toBeNull();
    });

    it('devuelve el token almacenado', () => {
      lsMock.setItem('token', 'stored-token');
      expect(service.getToken()).toBe('stored-token');
    });
  });

  describe('isAuthenticated / computed signals', () => {
    it('isAuthenticated es false cuando no hay usuario', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('isAdmin es false para un EMPLOYEE', () => {
      mockHttp.post.mockReturnValue(of(mockUserResponse));
      service.login('test@example.com', 'pass').subscribe();
      expect(service.isAdmin()).toBe(false);
    });

    it('isAdmin es true para un ADMIN', () => {
      mockHttp.post.mockReturnValue(of({ ...mockUserResponse, role: 'ADMIN' as const }));
      service.login('test@example.com', 'pass').subscribe();
      expect(service.isAdmin()).toBe(true);
    });

    it('isHrManager es true para HR_MANAGER', () => {
      mockHttp.post.mockReturnValue(of({ ...mockUserResponse, role: 'HR_MANAGER' as const }));
      service.login('test@example.com', 'pass').subscribe();
      expect(service.isHrManager()).toBe(true);
    });

    it('isHrManager es true para ADMIN', () => {
      mockHttp.post.mockReturnValue(of({ ...mockUserResponse, role: 'ADMIN' as const }));
      service.login('test@example.com', 'pass').subscribe();
      expect(service.isHrManager()).toBe(true);
    });
  });

  describe('hasRole', () => {
    it('devuelve false si no hay usuario', () => {
      expect(service.hasRole('ADMIN')).toBe(false);
    });

    it('devuelve true si el rol del usuario coincide', () => {
      mockHttp.post.mockReturnValue(of(mockUserResponse));
      service.login('test@example.com', 'pass').subscribe();
      expect(service.hasRole('EMPLOYEE')).toBe(true);
    });

    it('devuelve false si el rol no coincide', () => {
      mockHttp.post.mockReturnValue(of(mockUserResponse));
      service.login('test@example.com', 'pass').subscribe();
      expect(service.hasRole('ADMIN')).toBe(false);
    });

    it('acepta múltiples roles', () => {
      mockHttp.post.mockReturnValue(of(mockUserResponse));
      service.login('test@example.com', 'pass').subscribe();
      expect(service.hasRole('ADMIN', 'EMPLOYEE')).toBe(true);
    });
  });

  describe('updateProfile', () => {
    it('realiza PATCH a /auth/profile y actualiza la señal', () => {
      mockHttp.post.mockReturnValue(of(mockUserResponse));
      service.login('test@example.com', 'pass').subscribe();
      const updated = { name: 'Nuevo Nombre' };
      mockHttp.patch.mockReturnValue(of({ ...mockUserResponse, ...updated }));
      service.updateProfile(updated).subscribe();
      expect(mockHttp.patch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/profile'),
        updated,
      );
      expect(service.user()?.name).toBe('Nuevo Nombre');
    });
  });

  describe('changePassword', () => {
    it('realiza PATCH a /auth/change-password', () => {
      mockHttp.patch.mockReturnValue(of({ message: 'ok' }));
      service.changePassword('vieja', 'nueva').subscribe();
      expect(mockHttp.patch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/change-password'),
        { currentPassword: 'vieja', newPassword: 'nueva' },
      );
    });
  });

  describe('getProfile', () => {
    it('realiza GET a /auth/profile', () => {
      mockHttp.get.mockReturnValue(of(mockUserResponse));
      service.getProfile().subscribe();
      expect(mockHttp.get).toHaveBeenCalledWith(expect.stringContaining('/auth/profile'));
    });
  });

  describe('carga desde localStorage', () => {
    it('restaura el usuario si existe en localStorage', () => {
      lsMock.setItem('auth_user', JSON.stringify(mockUserResponse));
      const freshService = new AuthService(mockHttp as any, mockRouter as any);
      expect(freshService.isAuthenticated()).toBe(true);
      expect(freshService.user()?.email).toBe('test@example.com');
    });

    it('retorna null si localStorage tiene JSON inválido', () => {
      lsMock.setItem('auth_user', 'invalid-json{{{');
      const freshService = new AuthService(mockHttp as any, mockRouter as any);
      expect(freshService.isAuthenticated()).toBe(false);
    });
  });
});
