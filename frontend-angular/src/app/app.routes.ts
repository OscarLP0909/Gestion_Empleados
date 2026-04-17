import { Routes } from '@angular/router';
import { authGuard, adminGuard, hrGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'employees',
        loadComponent: () => import('./features/employees/list/employee-list.component').then(m => m.EmployeeListComponent)
      },
      {
        path: 'employees/new',
        loadComponent: () => import('./features/employees/form/employee-form.component').then(m => m.EmployeeFormComponent),
        canActivate: [hrGuard]
      },
      {
        path: 'employees/:id',
        loadComponent: () => import('./features/employees/detail/employee-detail.component').then(m => m.EmployeeDetailComponent)
      },
      {
        path: 'employees/:id/edit',
        loadComponent: () => import('./features/employees/form/employee-form.component').then(m => m.EmployeeFormComponent),
        canActivate: [hrGuard]
      },
      {
        path: 'contracts',
        loadComponent: () => import('./features/contracts/list/contract-list.component').then(m => m.ContractListComponent)
      },
      {
        path: 'contracts/new',
        loadComponent: () => import('./features/contracts/form/contract-form.component').then(m => m.ContractFormComponent),
        canActivate: [hrGuard]
      },
      {
        path: 'contracts/approvals',
        loadComponent: () => import('./features/contracts/approvals/contract-approvals.component').then(m => m.ContractApprovalsComponent),
        canActivate: [hrGuard]
      },
      {
        path: 'contracts/:id',
        loadComponent: () => import('./features/contracts/detail/contract-detail.component').then(m => m.ContractDetailComponent)
      },
      {
        path: 'contracts/:id/edit',
        loadComponent: () => import('./features/contracts/form/contract-form.component').then(m => m.ContractFormComponent),
        canActivate: [hrGuard]
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/list/user-list.component').then(m => m.UserListComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'users/new',
        loadComponent: () => import('./features/users/form/user-form.component').then(m => m.UserFormComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'audit',
        loadComponent: () => import('./features/audit/audit.component').then(m => m.AuditComponent),
        canActivate: [hrGuard]
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
