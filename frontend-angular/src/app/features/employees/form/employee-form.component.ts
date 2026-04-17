import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../../core/services/employee.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private notify = inject(NotificationService);

  isEdit = signal(false);
  loading = signal(false);
  loadingData = signal(false);
  employeeId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    surname: ['', [Validators.required, Validators.minLength(2)]],
    nif: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/i)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    city: [''],
    province: [''],
    country: ['']
  });

  constructor() {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && this.route.snapshot.url.some(s => s.path === 'edit')) {
      this.isEdit.set(true);
      this.employeeId.set(id);
      this.loadingData.set(true);
      this.employeeService.getById(id).subscribe({
        next: (emp) => {
          this.form.patchValue(emp);
          this.loadingData.set(false);
        },
        error: () => {
          this.notify.error('Error cargando empleado');
          this.router.navigate(['/employees']);
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const data = this.form.getRawValue();
    const obs = this.isEdit()
      ? this.employeeService.update(this.employeeId()!, data)
      : this.employeeService.create(data);

    obs.subscribe({
      next: (emp) => {
        this.notify.success(this.isEdit() ? 'Empleado actualizado' : 'Empleado creado correctamente');
        this.router.navigate(['/employees', emp._id ?? emp.id]);
      },
      error: (err) => {
        this.notify.error(err?.error?.message || 'Error al guardar empleado');
        this.loading.set(false);
      }
    });
  }

  f(name: string) { return this.form.get(name); }
  hasError(name: string, error: string) { const c = this.f(name); return c?.touched && c?.hasError(error); }
}
