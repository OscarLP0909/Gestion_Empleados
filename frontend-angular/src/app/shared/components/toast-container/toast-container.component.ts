import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="toast-container">
      @for (toast of notifications.toasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type" [@fadeSlide]>
          <mat-icon class="toast-icon">{{ getIcon(toast.type) }}</mat-icon>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="notifications.remove(toast.id)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 12px;
      background: #fff;
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      border-left: 4px solid;
      animation: slideIn 0.3s ease;
      color: #1e293b;
    }
    .toast-success { border-color: #10b981; .toast-icon { color: #10b981; } }
    .toast-error { border-color: #ef4444; .toast-icon { color: #ef4444; } }
    .toast-warning { border-color: #f59e0b; .toast-icon { color: #f59e0b; } }
    .toast-info { border-color: #3b82f6; .toast-icon { color: #3b82f6; } }
    .toast-message { flex: 1; font-size: 14px; font-weight: 500; }
    .toast-close {
      background: none; border: none; cursor: pointer; color: #94a3b8;
      padding: 2px; border-radius: 4px; display: flex;
      &:hover { color: #64748b; }
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastContainerComponent {
  constructor(public notifications: NotificationService) {}

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return icons[type] ?? 'notifications';
  }
}
