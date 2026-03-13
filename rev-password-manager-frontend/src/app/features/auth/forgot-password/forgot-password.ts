import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {

  form: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  // ✅ Fixed security questions
  questions: string[] = [
    "What is your mother's maiden name?",
    "What was your first school name?",
    "What is your favorite childhood friend name?"
  ];

  showNew = false;
  showConfirm = false;
  showAnswer = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {

    this.form = this.fb.group({
      username: ['', Validators.required],
      question: ['', Validators.required],
      answer: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  submit() {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.auth.forgotPassword({
      username: this.form.value.username.trim(),
      question: this.form.value.question,
      answer: this.form.value.answer,
      newPassword: this.form.value.newPassword
    })
    .subscribe({
      next: (response: string) => {
        this.successMessage = response || 'Password reset successful';
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage =
          err.error?.message || 'Reset failed';
        this.loading = false;
      }
    });
  }
}