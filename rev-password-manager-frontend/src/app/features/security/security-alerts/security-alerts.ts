import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-security-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinner],
  templateUrl: './security-alerts.html',
  styleUrls: ['./security-alerts.scss']
})
export class SecurityAlerts {

  masterPassword = '';
  alerts: string[] = [];  
  loading = false;
  errorMessage = '';
  alertsLoaded = false;

 constructor(
  private auth: AuthService,
  private cdr: ChangeDetectorRef
) {}

  loadAlerts() {

  if (!this.masterPassword.trim()) {
    this.errorMessage = 'Master password is required';
    return;
  }

  this.loading = true;
  this.errorMessage = '';
  this.alerts = [];
  this.alertsLoaded = false;

  this.auth.getSecurityAlerts(this.masterPassword)
    .subscribe({
      next: (res: any) => {

        console.log("Alerts response:", res);

        this.alerts = [...(res?.alerts || [])];
        this.alertsLoaded = true;

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {

        this.loading = false;
        this.alertsLoaded = false;

        this.errorMessage =
          err?.error?.message || 'Invalid master password';

        this.cdr.detectChanges();
      }
    });
}
  reset() {
  this.masterPassword = '';
  this.alerts = [];
  this.alertsLoaded = false;
  this.loading = false;
  this.errorMessage = '';
}
}