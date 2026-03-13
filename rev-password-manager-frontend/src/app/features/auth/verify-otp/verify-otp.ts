import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify-otp.html',
  styleUrls: ['./verify-otp.scss']
})
export class VerifyOtp {

  otp = '';
  loading = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit() {
if (this.loading) return; 
    const username = this.auth.getTempUsername();

    if (!username) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.otp || this.otp.trim().length !== 6) {
      this.errorMessage = 'Enter valid 6-digit OTP';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.auth.verify2FA({
      username: username,
      otp: this.otp.trim()
    }).subscribe({

      next: (res: any) => {

        if (!res.token) {
          this.errorMessage = 'Invalid response from server';
          this.loading = false;
          return;
        }

        this.auth.setToken(res.token);
        this.auth.clearTempUsername();
        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        console.log(err);
        this.errorMessage =
          err.error?.message || 'Invalid or expired code';
        this.loading = false;
      }
    });
  }

  resendOtp() {
    this.router.navigate(['/login']);
  }
}