import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class App implements OnInit {
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const dark = localStorage.getItem('darkMode') === 'true';
    if (dark) document.body.classList.add('dark-theme');
    // Si el usuario guardado no tiene role (bug del auth previo), limpiar sesión
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (!u.role || !u.email) {
          localStorage.removeItem('auth_user');
          localStorage.removeItem('token');
        }
      } catch { localStorage.removeItem('auth_user'); localStorage.removeItem('token'); }
    }
  }
}
