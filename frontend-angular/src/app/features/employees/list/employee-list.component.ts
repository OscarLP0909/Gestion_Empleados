import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmployeeService } from '../../../core/services/employee.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements OnInit {
  loading = signal(true);
  employees = signal<Employee[]>([]);
  search = signal('');
  deletingId = signal<string | null>(null);

  filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.employees().filter(e =>
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.surname.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.nif.toLowerCase().includes(q) ||
      (e.city ?? '').toLowerCase().includes(q)
    );
  });

  constructor(
    private employeeService: EmployeeService,
    private notify: NotificationService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.employeeService.getAll().subscribe({
      next: (data) => { this.employees.set(data); this.loading.set(false); },
      error: () => { this.notify.error('Error cargando empleados'); this.loading.set(false); }
    });
  }

  confirmDelete(emp: Employee): void {
    if (!confirm(`¿Eliminar a ${emp.name} ${emp.surname}? Esta acción no se puede deshacer.`)) return;
    const id = emp._id ?? emp.id!;
    this.deletingId.set(id);
    this.employeeService.delete(id).subscribe({
      next: () => {
        this.employees.update(list => list.filter(e => (e._id ?? e.id) !== id));
        this.notify.success('Empleado eliminado correctamente');
        this.deletingId.set(null);
      },
      error: (err) => {
        this.notify.error(err?.error?.message || 'Error al eliminar empleado');
        this.deletingId.set(null);
      }
    });
  }

  getId(e: Employee): string { return e._id ?? e.id ?? ''; }
}
