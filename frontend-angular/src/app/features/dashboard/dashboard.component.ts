import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { EmployeeService } from '../../core/services/employee.service';
import { ContractService } from '../../core/services/contract.service';
import { AuthService } from '../../core/services/auth.service';
import { Employee } from '../../core/models/employee.model';
import { Contract } from '../../core/models/contract.model';

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  route: string;
  queryParams?: Record<string, string>;
  change?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  employees = signal<Employee[]>([]);
  contracts = signal<Contract[]>([]);

  stats = computed((): StatCard[] => {
    const emps = this.employees();
    const conts = this.contracts();
    const active = conts.filter(c => c.status === 'ACTIVO').length;
    const pending = conts.filter(c => c.status === 'PENDIENTE').length;
    const finished = conts.filter(c => c.status === 'FINALIZADO').length;

    return [
      { title: 'Total Empleados', value: emps.length, icon: 'people', color: 'indigo', route: '/employees', change: '+2 este mes' },
      { title: 'Contratos Activos', value: active, icon: 'description', color: 'emerald', route: '/contracts', queryParams: { status: 'ACTIVO' }, change: `${pending} pendientes` },
      { title: 'Pendientes Aprobación', value: pending, icon: 'pending_actions', color: 'amber', route: '/contracts/approvals', change: 'Requieren atención' },
      { title: 'Finalizados', value: finished, icon: 'check_circle', color: 'slate', route: '/contracts', queryParams: { status: 'FINALIZADO' }, change: 'Total histórico' }
    ];
  });

  contractsByType = computed(() => {
    const conts = this.contracts();
    const types = ['Indefinido', 'Prácticas', 'Formación', 'Eventual'];
    return types.map(type => ({
      type,
      count: conts.filter(c => c.contractType === type).length,
      pct: conts.length ? Math.round(conts.filter(c => c.contractType === type).length / conts.length * 100) : 0
    }));
  });

  contractsByStatus = computed(() => {
    const conts = this.contracts();
    const statuses = [
      { key: 'ACTIVO', label: 'Activo', color: '#10b981' },
      { key: 'PENDIENTE', label: 'Pendiente', color: '#f59e0b' },
      { key: 'APROBADO', label: 'Aprobado', color: '#3b82f6' },
      { key: 'RECHAZADO', label: 'Rechazado', color: '#ef4444' },
      { key: 'FINALIZADO', label: 'Finalizado', color: '#94a3b8' }
    ];
    return statuses.map(s => ({
      ...s,
      count: conts.filter(c => c.status === s.key).length,
      pct: conts.length ? Math.round(conts.filter(c => c.status === s.key).length / conts.length * 100) : 0
    })).filter(s => s.count > 0);
  });

  recentEmployees = computed(() => this.employees().slice(-5).reverse());

  user = computed(() => this.auth.user());

  constructor(private employeeService: EmployeeService, private contractService: ContractService, public auth: AuthService) {}

  ngOnInit(): void {
    forkJoin({
      employees: this.employeeService.getAll(),
      contracts: this.contractService.getAll()
    }).subscribe({
      next: ({ employees, contracts }) => {
        console.log('Employees:', employees);
        console.log('Contracts:', contracts);
        this.employees.set(Array.isArray(employees) ? employees : []);
        this.contracts.set(Array.isArray(contracts) ? contracts : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Dashboard error:', err?.status, err?.message, err?.error);
        this.loading.set(false);
      }
    });
  }

  getEmpId(emp: Employee): string { return emp._id ?? emp.id ?? ''; }

  getEmailPrefix(): string { return this.auth.user()?.email?.split('@')[0] ?? ''; }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }

  trackByRoute(_: number, item: StatCard) { return item.route; }
}
