import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../core/services/employee.service';
import { ContractService } from '../../core/services/contract.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  loading = signal(true);
  employees = signal<any[]>([]);
  contracts = signal<any[]>([]);

  activeContracts = computed(() => this.contracts().filter(c => c.status === 'ACTIVO').length);

  byDepartment = computed(() => {
    const deps = new Map<string, number>();
    this.contracts().forEach(c => deps.set(c.department, (deps.get(c.department) ?? 0) + 1));
    const max = Math.max(...deps.values(), 1);
    return [...deps.entries()]
      .map(([dep, count]) => ({ dep, count, pct: Math.round(count / max * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  });

  salaryStats = computed(() => {
    const salaries = this.contracts().filter(c => c.status === 'ACTIVO').map(c => c.salaryAmount);
    if (!salaries.length) return null;
    const avg = salaries.reduce((s, n) => s + n, 0) / salaries.length;
    const min = Math.min(...salaries);
    const max = Math.max(...salaries);
    const range = max - min || 1;
    return {
      avg: Math.round(avg),
      min,
      max,
      total: salaries.length,
      avgPct: Math.round((avg - min) / range * 100)
    };
  });

  contractsByStatus = computed(() => {
    const conts = this.contracts();
    const statuses = [
      { key: 'ACTIVO', label: 'Activo', color: '#059669' },
      { key: 'PENDIENTE', label: 'Pendiente', color: '#d97706' },
      { key: 'APROBADO', label: 'Aprobado', color: '#2563eb' },
      { key: 'RECHAZADO', label: 'Rechazado', color: '#dc2626' },
      { key: 'FINALIZADO', label: 'Finalizado', color: '#94a3b8' }
    ];
    return statuses.map(s => ({
      ...s,
      count: conts.filter(c => c.status === s.key).length,
      pct: conts.length ? Math.round(conts.filter(c => c.status === s.key).length / conts.length * 100) : 0
    })).filter(s => s.count > 0);
  });

  byCountry = computed(() => {
    const map = new Map<string, number>();
    this.employees().forEach(e => {
      const key = e.country || 'Sin especificar';
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    const max = Math.max(...map.values(), 1);
    return [...map.entries()]
      .map(([country, count]) => ({ country, count, pct: Math.round(count / max * 100) }))
      .sort((a, b) => b.count - a.count);
  });

  constructor(
    private employeeService: EmployeeService,
    private contractService: ContractService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    forkJoin({ employees: this.employeeService.getAll(), contracts: this.contractService.getAll() }).subscribe({
      next: ({ employees, contracts }) => {
        this.employees.set(employees);
        this.contracts.set(contracts);
        this.loading.set(false);
      },
      error: () => { this.notify.error('Error cargando datos'); this.loading.set(false); }
    });
  }

  exportCSV(): void {
    const rows = [
      ['Tipo', 'Puesto', 'Departamento', 'Salario', 'Estado', 'Inicio'],
      ...this.contracts().map(c => [c.contractType, c.position, c.department, c.salaryAmount, c.status, new Date(c.startDate).toLocaleDateString()])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'contratos.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
