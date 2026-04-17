import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, NonNullableFormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  public auth = inject(AuthService);
  private notify = inject(NotificationService);

  savingProfile = signal(false);
  savingPassword = signal(false);
  showCurrent = signal(false);
  showNew = signal(false);

  profileForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor() {}

  ngOnInit(): void {
    const u = this.auth.user();
    if (u) this.profileForm.patchValue({ name: u.name || '', email: u.email });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    this.savingProfile.set(true);
    this.auth.updateProfile(this.profileForm.getRawValue()).subscribe({
      next: () => { this.notify.success('Perfil actualizado'); this.savingProfile.set(false); },
      error: (err) => { this.notify.error(err?.error?.message || 'Error al actualizar'); this.savingProfile.set(false); }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    this.savingPassword.set(true);
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => { this.notify.success('Contraseña cambiada'); this.passwordForm.reset(); this.savingPassword.set(false); },
      error: (err) => { this.notify.error(err?.error?.message || 'Error al cambiar contraseña'); this.savingPassword.set(false); }
    });
  }

  getUserInitials(): string {
    const u = this.auth.user();
    if (!u) return '?';
    return (u.name || u.email).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getRoleBadge(): string {
    const m: Record<string, string> = { ADMIN: 'badge-danger', HR_MANAGER: 'badge-info', MANAGER: 'badge-warning', EMPLOYEE: 'badge-secondary' };
    return m[this.auth.user()?.role ?? ''] ?? 'badge-secondary';
  }

  pf(n: string) { return this.profileForm.get(n); }
  pw(n: string) { return this.passwordForm.get(n); }
}
