import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-strength-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './strength-analysis.html',
  styleUrls: ['./strength-analysis.scss']
})
export class StrengthAnalysis {

  password = '';
  strength = '';
  showPassword = false;
  loading = false;

  constructor(
  private auth: AuthService,
  private cdr: ChangeDetectorRef
) {}

  checkStrength() {

  if (!this.password.trim()) return;

  if (this.loading) return;

  this.loading = true;
  this.strength = '';

  this.auth.checkPasswordStrength(this.password)
    .subscribe({
      next: (res: any) => {

        console.log("Strength response:", res);

        this.strength = res?.strength || 'UNKNOWN';

        this.loading = false;

        this.cdr.detectChanges();   
      },

      error: () => {
        this.loading = false;
        this.strength = 'ERROR';
        this.cdr.detectChanges();
      }
    });
}
}