import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  form: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      masterPassword: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.loading) return; 

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.auth.login(this.form.value).subscribe({

      next: (res: any) => {

        if (res.token && !res.otpRequired) {
          this.auth.setToken(res.token);
          this.router.navigate(['/dashboard']);
          return;
        }

        if (res.otpRequired) {
          this.auth.setTempUsername(this.form.value.username);
          this.router.navigate(['/verify-2fa']);
          return;
        }

        this.errorMessage = 'Unexpected login response';
        this.loading = false;
      },

      error: (err: any) => {
        this.errorMessage =
          err.error?.message || 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}