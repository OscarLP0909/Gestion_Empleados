import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '../../../core/services/employee.service';
import { ContractService } from '../../../core/services/contract.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Employee } from '../../../core/models/employee.model';
import { Contract } from '../../../core/models/contract.model';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {
  loading = signal(true);
  employee = signal<Employee | null>(null);
  contracts = signal<Contract[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private contractService: ContractService,
    private notify: NotificationService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.employeeService.getById(id).subscribe({
      next: (emp) => {
        this.employee.set(emp);
        this.loading.set(false);
        this.contractService.getByEmployeeId(this.getId(emp)).subscribe({
          next: (c) => this.contracts.set(c),
          error: () => {}
        });
      },
      error: () => {
        this.notify.error('Empleado no encontrado');
        this.router.navigate(['/employees']);
      }
    });
  }

  getId(e: Employee): string { return e._id ?? e.id ?? ''; }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      ACTIVO: 'badge-success', PENDIENTE: 'badge-warning',
      APROBADO: 'badge-info', RECHAZADO: 'badge-danger', FINALIZADO: 'badge-secondary'
    };
    return map[status] ?? 'badge-secondary';
  }

  confirmDelete(): void {
    const emp = this.employee();
    if (!emp) return;
    if (!confirm(`¿Eliminar a ${emp.name} ${emp.surname}?`)) return;
    this.employeeService.delete(this.getId(emp)).subscribe({
      next: () => { this.notify.success('Empleado eliminado'); this.router.navigate(['/employees']); },
      error: (err) => this.notify.error(err?.error?.message || 'Error al eliminar')
    });
  }
}
