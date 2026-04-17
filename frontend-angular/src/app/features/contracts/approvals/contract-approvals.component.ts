import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractService } from '../../../core/services/contract.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Contract, ContractStatus } from '../../../core/models/contract.model';

@Component({
  selector: 'app-contract-approvals',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './contract-approvals.component.html',
  styleUrl: './contract-approvals.component.scss'
})
export class ContractApprovalsComponent implements OnInit {
  loading = signal(true);
  contracts = signal<Contract[]>([]);
  processing = signal<string | null>(null);

  constructor(private contractService: ContractService, private notify: NotificationService) {}

  ngOnInit(): void {
    this.contractService.getPending().subscribe({
      next: (data) => { this.contracts.set(data); this.loading.set(false); },
      error: () => { this.notify.error('Error cargando contratos pendientes'); this.loading.set(false); }
    });
  }

  approve(c: Contract): void { this.changeStatus(c, 'APROBADO'); }
  reject(c: Contract): void { this.changeStatus(c, 'RECHAZADO'); }

  private changeStatus(c: Contract, status: ContractStatus): void {
    const id = c._id ?? c.id!;
    this.processing.set(id);
    this.contractService.updateStatus(id, status).subscribe({
      next: () => {
        this.contracts.update(list => list.filter(x => (x._id ?? x.id) !== id));
        this.notify.success(`Contrato ${status === 'APROBADO' ? 'aprobado' : 'rechazado'}`);
        this.processing.set(null);
      },
      error: (err) => {
        this.notify.error(err?.error?.message || 'Error al procesar');
        this.processing.set(null);
      }
    });
  }

  getId(c: Contract): string { return c._id ?? c.id ?? ''; }
}
