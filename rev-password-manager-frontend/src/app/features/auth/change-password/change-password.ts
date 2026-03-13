import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss']
})
export class ChangePassword {

  form: FormGroup;
  loading = false;
  message = '';
  errorMessage = '';

  showCurrent = false;
  showNew = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  submit() {

    this.message = '';
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.auth.changeMasterPassword({
      oldPassword: this.form.value.currentPassword,
      newPassword: this.form.value.newPassword
    })
    .subscribe({
      next: () => {
        this.message = 'Master password changed successfully';
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage =
          err.error?.message || 'Failed to change password';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}