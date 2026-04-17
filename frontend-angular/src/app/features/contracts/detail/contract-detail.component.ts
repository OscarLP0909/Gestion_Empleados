import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractService } from '../../../core/services/contract.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Contract, ContractStatus } from '../../../core/models/contract.model';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './contract-detail.component.html',
  styleUrl: './contract-detail.component.scss'
})
export class ContractDetailComponent implements OnInit {
  loading = signal(true);
  contract = signal<Contract | null>(null);
  updatingStatus = signal(false);

  readonly statuses: ContractStatus[] = ['PENDIENTE', 'APROBADO', 'ACTIVO', 'RECHAZADO', 'FINALIZADO'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService,
    private notify: NotificationService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.contractService.getById(id).subscribe({
      next: (c) => { this.contract.set(c); this.loading.set(false); },
      error: () => { this.notify.error('Contrato no encontrado'); this.router.navigate(['/contracts']); }
    });
  }

  changeStatus(status: ContractStatus): void {
    const c = this.contract();
    if (!c) return;
    this.updatingStatus.set(true);
    this.contractService.updateStatus(c._id ?? c.id!, status).subscribe({
      next: (updated) => {
        this.contract.set(updated);
        this.notify.success(`Estado cambiado a ${status}`);
        this.updatingStatus.set(false);
      },
      error: (err) => {
        this.notify.error(err?.error?.message || 'Error al cambiar estado');
        this.updatingStatus.set(false);
      }
    });
  }

  confirmDelete(): void {
    if (!confirm('¿Eliminar este contrato?')) return;
    const c = this.contract()!;
    this.contractService.delete(c._id ?? c.id!).subscribe({
      next: () => { this.notify.success('Contrato eliminado'); this.router.navigate(['/contracts']); },
      error: (err) => this.notify.error(err?.error?.message || 'Error al eliminar')
    });
  }

  getStatusClass(s: string): string {
    const m: Record<string, string> = {
      ACTIVO: 'badge-success', PENDIENTE: 'badge-warning',
      APROBADO: 'badge-info', RECHAZADO: 'badge-danger', FINALIZADO: 'badge-secondary'
    };
    return m[s] ?? 'badge-secondary';
  }

  getId(c: Contract): string { return c._id ?? c.id ?? ''; }
}
