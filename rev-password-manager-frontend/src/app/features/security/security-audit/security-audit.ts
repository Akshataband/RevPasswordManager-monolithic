import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-security-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinner],
  templateUrl: './security-audit.html',
  styleUrls: ['./security-audit.scss']
})
export class SecurityAudit {

  masterPassword = '';
  report: any = null;
  loading = false;
  errorMessage = '';
  auditStarted = false;

  constructor(
  private auth: AuthService,
  private cdr: ChangeDetectorRef
) {}

  runAudit() {

  if (!this.masterPassword.trim()) {
    this.errorMessage = 'Master password is required';
    return;
  }

  this.loading = true;
  this.errorMessage = '';
  this.report = null;

  this.auth.securityAudit(this.masterPassword)
    .subscribe({
      next: (res: any) => {

        console.log("Audit response:", res);

        this.report = { ...res };   // force new object reference
        this.auditStarted = true;

        this.loading = false;

        this.cdr.detectChanges();   // force Angular refresh
      },

      error: (err) => {

        this.loading = false;
        this.auditStarted = false;

        this.errorMessage =
          err?.error?.message || 'Invalid master password';

        this.cdr.detectChanges();
      }
    });
}
  reset() {
    this.masterPassword = '';
    this.report = null;
    this.auditStarted = false;
    this.errorMessage = '';
  }
}