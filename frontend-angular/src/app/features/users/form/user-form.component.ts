import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private userService = inject(UserService);
  private notify = inject(NotificationService);

  loading = signal(false);
  showPassword = signal(false);
  readonly roles: UserRole[] = ['ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'];

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['EMPLOYEE' as UserRole, Validators.required]
  });

  constructor() {}

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.userService.create(this.form.getRawValue()).subscribe({
      next: () => { this.notify.success('Usuario creado correctamente'); this.router.navigate(['/users']); },
      error: (err) => { this.notify.error(err?.error?.message || 'Error al crear usuario'); this.loading.set(false); }
    });
  }

  f(n: string) { return this.form.get(n); }
  hasError(n: string, e: string) { const c = this.f(n); return c?.touched && c?.hasError(e); }
}
