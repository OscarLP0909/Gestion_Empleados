import { Component, signal, computed, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ToastContainerComponent } from '../components/toast-container/toast-container.component';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
  badge?: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive, CommonModule,
    MatIconModule, MatTooltipModule, MatBadgeModule, ToastContainerComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  sidebarCollapsed = signal(false);
  mobileOpen = signal(false);
  darkMode = signal(localStorage.getItem('darkMode') === 'true');

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Empleados', icon: 'people', route: '/employees' },
    { label: 'Contratos', icon: 'description', route: '/contracts' },
    { label: 'Aprobaciones', icon: 'check_circle', route: '/contracts/approvals', roles: ['ADMIN', 'HR_MANAGER'] },
    { label: 'Informes', icon: 'bar_chart', route: '/reports' },
    { label: 'Usuarios', icon: 'manage_accounts', route: '/users', roles: ['ADMIN'] },
    { label: 'Auditoría', icon: 'history', route: '/audit', roles: ['ADMIN', 'HR_MANAGER'] },
    { label: 'Mi Perfil', icon: 'account_circle', route: '/profile' }
  ];

  visibleItems = computed(() => {
    const role = this.auth.userRole();
    return this.navItems.filter(item => !item.roles || (role && item.roles.includes(role)));
  });

  user = computed(() => this.auth.user());

  constructor(public auth: AuthService, public notifications: NotificationService) {}

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  toggleDarkMode(): void {
    const next = !this.darkMode();
    this.darkMode.set(next);
    localStorage.setItem('darkMode', String(next));
    document.body.classList.toggle('dark-theme', next);
  }

  logout(): void {
    this.auth.logout();
  }

  getUserInitials(): string {
    const u = this.auth.user();
    if (!u) return '?';
    const name = u.name || u.email || '';
    if (!name) return '?';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  @HostListener('document:keydown.escape')
  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}
