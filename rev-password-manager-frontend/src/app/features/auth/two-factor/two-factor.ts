import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './two-factor.html',
  styleUrls: ['./two-factor.scss']
})
export class TwoFactor implements OnInit {

  isEnabled = false;
  isLoading = true;

   enableLoading = false;
  confirmLoading = false;
  disableLoading = false;

  qrCode: string | null = null;

  confirmCode = '';   
  disableCode = '';  

  errorMessage = '';

  constructor(
  private auth: AuthService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  loadStatus() {

  this.isLoading = true;

  this.auth.get2FAStatus().subscribe({

    next: (res: boolean) => {

      this.isEnabled = res;
      this.isLoading = false;

      this.cdr.detectChanges();
    },

    error: () => {

      this.isLoading = false;

      this.cdr.detectChanges();
    }
  });
}
  enable2FA() {

  if (this.enableLoading) return;

  this.enableLoading = true;
  this.errorMessage = '';

  this.auth.enable2FA().subscribe({

    next: (res: any) => {

      console.log("QR response:", res);

      const otpUrl =
        res?.qr ||
        res?.data?.qr ||
        res?.otpAuthUrl ||
        res?.otpauth ||
        '';

      if (!otpUrl) {
        this.errorMessage = 'QR code not received from server';
        this.enableLoading = false;
        return;
      }

      this.qrCode =
        'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='
        + encodeURIComponent(otpUrl);

      this.enableLoading = false;

      this.cdr.detectChanges();   // 🔥 forces UI render
    },

    error: () => {

      this.errorMessage = 'Failed to generate QR code';
      this.enableLoading = false;

      this.cdr.detectChanges();
    }
  });
}

  confirm2FA() {
    if (!this.confirmCode.trim()) {
      this.errorMessage = 'OTP is required';
      return;
    }
    if (this.confirmLoading) return;

    this.confirmLoading = true;

    this.errorMessage = '';

    this.auth.confirm2FA(this.confirmCode.trim()).subscribe({
      next: () => {
        this.qrCode = null;
        this.confirmCode = '';
        this.confirmLoading = false;
        this.loadStatus();
      },
      error: (err) => {
        this.errorMessage = 'Invalid or expired OTP';
        this.confirmLoading = false;
      }
    });
  }

  disable2FA() {
    if (!this.disableCode.trim()) {
      this.errorMessage = 'OTP is required';
      return;
    }
    if (this.disableLoading) return;
this.disableLoading = true;
    this.errorMessage = '';

    this.auth.disable2FA(this.disableCode.trim()).subscribe({
      next: () => {
        this.disableCode = '';
        this.disableLoading = false;
        this.loadStatus();
      },
      error: () => {
        this.errorMessage = 'Invalid OTP';
        this.disableLoading = false;
      }
    });
  }
}