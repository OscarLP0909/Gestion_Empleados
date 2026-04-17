import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuditService } from '../../core/services/audit.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuditLog } from '../../core/models/audit.model';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.scss'
})
export class AuditComponent implements OnInit {
  loading = signal(true);
  logs = signal<AuditLog[]>([]);
  total = signal(0);
  page = signal(1);
  limit = 20;

  filters = {
    action: '',
    entityType: '',
    startDate: '',
    endDate: ''
  };

  readonly actions = ['CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE', 'ROLE_CHANGE'];
  readonly entityTypes = ['EMPLOYEE', 'CONTRACT', 'USER'];

  constructor(private auditService: AuditService, private notify: NotificationService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.auditService.getLogs({ ...this.filters, page: this.page(), limit: this.limit }).subscribe({
      next: (res) => {
        this.logs.set(res.logs);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => { this.notify.error('Error cargando auditoría'); this.loading.set(false); }
    });
  }

  applyFilters(): void { this.page.set(1); this.load(); }
  clearFilters(): void { this.filters = { action: '', entityType: '', startDate: '', endDate: '' }; this.applyFilters(); }

  prevPage(): void { if (this.page() > 1) { this.page.update(p => p - 1); this.load(); } }
  nextPage(): void { if (this.page() * this.limit < this.total()) { this.page.update(p => p + 1); this.load(); } }

  get totalPages(): number { return Math.ceil(this.total() / this.limit); }

  getActionClass(action: string): string {
    const m: Record<string, string> = {
      CREATE: 'badge-success', UPDATE: 'badge-info',
      DELETE: 'badge-danger', STATUS_CHANGE: 'badge-warning', ROLE_CHANGE: 'badge-warning'
    };
    return m[action] ?? 'badge-secondary';
  }

  getActionIcon(action: string): string {
    const m: Record<string, string> = {
      CREATE: 'add_circle', UPDATE: 'edit', DELETE: 'delete',
      STATUS_CHANGE: 'swap_horiz', ROLE_CHANGE: 'manage_accounts'
    };
    return m[action] ?? 'info';
  }
}
