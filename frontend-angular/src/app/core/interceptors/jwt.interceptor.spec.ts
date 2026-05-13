import '@angular/compiler';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { of } from 'rxjs';
import { jwtInterceptor } from './jwt.interceptor';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { AuthService } from '../services/auth.service';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

afterEach(() => getTestBed().resetTestingModule());

const makeAuthService = (token: string | null) =>
  ({ getToken: vi.fn().mockReturnValue(token) } as unknown as AuthService);

const makeRequest = () => ({
  clone: vi.fn().mockImplementation((opts: any) => ({ cloneOpts: opts })),
  headers: {},
});

const makeNext = () => vi.fn().mockImplementation((req: any) => of(req));

describe('jwtInterceptor', () => {
  it('agrega el header Authorization si hay token', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: makeAuthService('mi-jwt-token') }],
    });
    const req = makeRequest();
    const next = makeNext();

    TestBed.runInInjectionContext(() => jwtInterceptor(req as any, next));

    expect(req.clone).toHaveBeenCalledWith({
      setHeaders: { Authorization: 'Bearer mi-jwt-token' },
    });
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ cloneOpts: expect.any(Object) }));
  });

  it('no modifica la request si no hay token', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: makeAuthService(null) }],
    });
    const req = makeRequest();
    const next = makeNext();

    TestBed.runInInjectionContext(() => jwtInterceptor(req as any, next));

    expect(req.clone).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(req);
  });

  it('el header usa el formato Bearer correcto', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: makeAuthService('token-xyz-123') }],
    });
    const req = makeRequest();
    const next = makeNext();

    TestBed.runInInjectionContext(() => jwtInterceptor(req as any, next));

    const cloneArg = (req.clone as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(cloneArg.setHeaders.Authorization).toBe('Bearer token-xyz-123');
  });
});
