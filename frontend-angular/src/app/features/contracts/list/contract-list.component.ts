import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContractService } from '../../../core/services/contract.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Contract, ContractStatus } from '../../../core/models/contract.model';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.scss'
})
export class ContractListComponent implements OnInit {
  loading = signal(true);
  contracts = signal<Contract[]>([]);
  search = signal('');
  statusFilter = signal<ContractStatus | ''>('');
  deletingId = signal<string | null>(null);

  readonly statuses: ContractStatus[] = ['PENDIENTE', 'APROBADO', 'ACTIVO', 'RECHAZADO', 'FINALIZADO'];

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    const sf = this.statusFilter();
    return this.contracts().filter(c => {
      const emp = c.employee;
      const matchQ = !q ||
        (emp ? `${emp.name} ${emp.surname}`.toLowerCase().includes(q) : false) ||
        c.department.toLowerCase().includes(q) ||
        c.position.toLowerCase().includes(q) ||
        c.contractType.toLowerCase().includes(q);
      const matchS = !sf || c.status === sf;
      return matchQ && matchS;
    });
  });

  constructor(
    private contractService: ContractService,
    private notify: NotificationService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.contractService.getAll().subscribe({
      next: (data) => { this.contracts.set(data); this.loading.set(false); },
      error: () => { this.notify.error('Error cargando contratos'); this.loading.set(false); }
    });
  }

  confirmDelete(c: Contract): void {
    if (!confirm('¿Eliminar este contrato?')) return;
    const id = c._id ?? c.id!;
    this.deletingId.set(id);
    this.contractService.delete(id).subscribe({
      next: () => {
        this.contracts.update(list => list.filter(x => (x._id ?? x.id) !== id));
        this.notify.success('Contrato eliminado');
        this.deletingId.set(null);
      },
      error: (err) => {
        this.notify.error(err?.error?.message || 'Error al eliminar');
        this.deletingId.set(null);
      }
    });
  }

  getStatusClass(status: string): string {
    const m: Record<string, string> = {
      ACTIVO: 'badge-success', PENDIENTE: 'badge-warning',
      APROBADO: 'badge-info', RECHAZADO: 'badge-danger', FINALIZADO: 'badge-secondary'
    };
    return m[status] ?? 'badge-secondary';
  }

  getId(c: Contract): string { return c._id ?? c.id ?? ''; }
}
