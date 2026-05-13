import '@angular/compiler';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard, adminGuard, hrGuard } from './auth.guard';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

const makeAuthService = (overrides = {}) =>
  ({
    isAuthenticated: vi.fn().mockReturnValue(false),
    isAdmin: vi.fn().mockReturnValue(false),
    isHrManager: vi.fn().mockReturnValue(false),
    ...overrides,
  } as unknown as AuthService);

const makeRouter = () => ({ navigate: vi.fn() } as unknown as Router);

afterEach(() => getTestBed().resetTestingModule());

describe('authGuard', () => {
  let mockAuth: ReturnType<typeof makeAuthService>;
  let mockRouter: ReturnType<typeof makeRouter>;

  beforeEach(() => {
    mockAuth = makeAuthService();
    mockRouter = makeRouter();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('devuelve true si el usuario está autenticado', () => {
    (mockAuth.isAuthenticated as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() => authGuard());
    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('navega a /login y retorna false si no está autenticado', () => {
    const result = TestBed.runInInjectionContext(() => authGuard());
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});

describe('adminGuard', () => {
  let mockAuth: ReturnType<typeof makeAuthService>;
  let mockRouter: ReturnType<typeof makeRouter>;

  beforeEach(() => {
    mockAuth = makeAuthService();
    mockRouter = makeRouter();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('devuelve true si es administrador', () => {
    (mockAuth.isAdmin as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() => adminGuard());
    expect(result).toBe(true);
  });

  it('navega a /dashboard y retorna false si no es admin', () => {
    const result = TestBed.runInInjectionContext(() => adminGuard());
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});

describe('hrGuard', () => {
  let mockAuth: ReturnType<typeof makeAuthService>;
  let mockRouter: ReturnType<typeof makeRouter>;

  beforeEach(() => {
    mockAuth = makeAuthService();
    mockRouter = makeRouter();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('devuelve true si es HR Manager', () => {
    (mockAuth.isHrManager as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const result = TestBed.runInInjectionContext(() => hrGuard());
    expect(result).toBe(true);
  });

  it('navega a /dashboard y retorna false si no es HR Manager', () => {
    const result = TestBed.runInInjectionContext(() => hrGuard());
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
