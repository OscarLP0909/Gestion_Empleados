import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  loading = signal(true);
  users = signal<User[]>([]);
  processing = signal<string | null>(null);

  readonly roles: UserRole[] = ['ADMIN', 'HR_MANAGER', 'MANAGER', 'EMPLOYEE'];

  constructor(private userService: UserService, private notify: NotificationService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: (data) => { this.users.set(data); this.loading.set(false); },
      error: () => { this.notify.error('Error cargando usuarios'); this.loading.set(false); }
    });
  }

  changeRole(user: User, role: UserRole): void {
    const id = user._id ?? user.id!;
    this.processing.set(id);
    this.userService.updateRole(id, role).subscribe({
      next: (u) => {
        this.users.update(list => list.map(x => (x._id ?? x.id) === id ? { ...x, role: u.role } : x));
        this.notify.success('Rol actualizado');
        this.processing.set(null);
      },
      error: (err) => { this.notify.error(err?.error?.message || 'Error al actualizar'); this.processing.set(null); }
    });
  }

  toggleActive(user: User): void {
    const id = user._id ?? user.id!;
    this.processing.set(id);
    const obs = user.isActive ? this.userService.deactivate(id) : this.userService.activate(id);
    obs.subscribe({
      next: () => {
        this.users.update(list => list.map(x => (x._id ?? x.id) === id ? { ...x, isActive: !x.isActive } : x));
        this.notify.success(user.isActive ? 'Usuario desactivado' : 'Usuario activado');
        this.processing.set(null);
      },
      error: (err) => { this.notify.error(err?.error?.message || 'Error'); this.processing.set(null); }
    });
  }

  getRoleClass(role: string): string {
    const m: Record<string, string> = {
      ADMIN: 'badge-danger', HR_MANAGER: 'badge-info', MANAGER: 'badge-warning', EMPLOYEE: 'badge-secondary'
    };
    return m[role] ?? 'badge-secondary';
  }

  getId(u: User): string { return u._id ?? u.id ?? ''; }
}
