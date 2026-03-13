import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinner],
  templateUrl: './backup.html',
  styleUrls: ['./backup.scss']
})
export class Backup {

  masterPassword = '';
  loading = false;
  successMessage = '';
  errorMessage = '';
  selectedFileContent = '';

  constructor(
    private service: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  // ================= EXPORT BACKUP =================

  exportBackup() {

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.masterPassword.trim()) {
      this.errorMessage = 'Master password is required';
      return;
    }

    this.loading = true;

    this.service.exportBackup(this.masterPassword)
      .subscribe({

        next: (blob: Blob) => {

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');

          a.href = url;
          a.download = 'revvault-backup.enc';
          a.click();

          window.URL.revokeObjectURL(url);

          this.successMessage = 'Backup downloaded successfully';
          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (err: any) => {

          this.errorMessage =
            err?.error?.message || 'Backup download failed';

          this.loading = false;

          this.cdr.detectChanges();
        }

      });

  }

  // ================= FILE SELECT =================

  onFileSelected(event: any) {

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.enc')) {
      this.errorMessage = 'Invalid backup file format';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.selectedFileContent = reader.result as string;
    };

    reader.readAsText(file);
  }

  // ================= IMPORT BACKUP =================

  importBackup() {

    if (this.loading) return;

    if (!this.masterPassword) {
      this.errorMessage = 'Master password is required';
      return;
    }

    if (!this.selectedFileContent) {
      this.errorMessage = 'Please select a backup file';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.service.importBackup({
      masterPassword: this.masterPassword,
      encryptedBackup: this.selectedFileContent
    }).subscribe({

      next: () => {

        this.successMessage = 'Backup imported successfully';

        this.selectedFileContent = '';
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (err: any) => {

        this.errorMessage =
          err?.error?.message || 'Import failed';

        this.loading = false;

        this.cdr.detectChanges();
      }

    });

  }

  // ================= RESET =================

  reset() {
    this.masterPassword = '';
    this.selectedFileContent = '';
    this.successMessage = '';
    this.errorMessage = '';
    this.loading = false;

    this.cdr.detectChanges();
  }

}