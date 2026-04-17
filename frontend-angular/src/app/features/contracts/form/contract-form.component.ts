import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractService } from '../../../core/services/contract.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './contract-form.component.html',
  styleUrl: './contract-form.component.scss'
})
export class ContractFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contractService = inject(ContractService);
  private employeeService = inject(EmployeeService);
  private notify = inject(NotificationService);

  isEdit = signal(false);
  loading = signal(false);
  loadingData = signal(true);
  contractId = signal<string | null>(null);
  employees = signal<Employee[]>([]);

  readonly contractTypes = ['Indefinido', 'Prácticas', 'Formación', 'Eventual'] as const;
  readonly workdayTypes = ['Completa', 'Parcial'] as const;
  readonly salaryTypes = ['Bruto', 'Neto'] as const;

  form = this.fb.group({
    employeeId: ['', Validators.required],
    contractType: ['Indefinido' as string, Validators.required],
    workdayType: ['Completa' as string, Validators.required],
    salaryType: ['Bruto' as string, Validators.required],
    salaryAmount: [0, [Validators.required, Validators.min(1)]],
    startDate: ['', Validators.required],
    endDate: [''],
    department: ['', Validators.required],
    category: ['', Validators.required],
    position: ['', Validators.required],
    temporaryType: ['']
  });

  constructor() {}

  ngOnInit(): void {
    this.employeeService.getAll().subscribe({
      next: (emps) => {
        this.employees.set(emps);
        const id = this.route.snapshot.paramMap.get('id');
        if (id && this.route.snapshot.url.some(s => s.path === 'edit')) {
          this.isEdit.set(true);
          this.contractId.set(id);
          this.contractService.getById(id).subscribe({
            next: (c) => {
              this.form.patchValue({
                ...c,
                startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '',
                endDate: c.endDate ? new Date(c.endDate).toISOString().split('T')[0] : ''
              });
              this.loadingData.set(false);
            },
            error: () => { this.notify.error('Error cargando contrato'); this.router.navigate(['/contracts']); }
          });
        } else {
          this.loadingData.set(false);
        }
      },
      error: () => { this.notify.error('Error cargando empleados'); this.loadingData.set(false); }
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const data = this.form.getRawValue() as any;
    const obs = this.isEdit()
      ? this.contractService.update(this.contractId()!, data)
      : this.contractService.create(data);

    obs.subscribe({
      next: (c) => {
        this.notify.success(this.isEdit() ? 'Contrato actualizado' : 'Contrato creado');
        this.router.navigate(['/contracts', c._id ?? c.id]);
      },
      error: (err) => {
        this.notify.error(err?.error?.message || 'Error al guardar');
        this.loading.set(false);
      }
    });
  }

  f(n: string) { return this.form.get(n); }
  hasError(n: string, e: string) { const c = this.f(n); return c?.touched && c?.hasError(e); }
  getEmpName(e: Employee): string { return `${e.name} ${e.surname} (${e.nif})`; }
  getId(e: Employee): string { return e._id ?? e.id ?? ''; }
}
