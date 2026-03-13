import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { StatsCard } from '../../shared/components/stats-card/stats-card';
import { AuthService } from '../../core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinner,
    StatsCard
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {

  data: any;
  isLoading = true;

  constructor(
  private auth: AuthService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

loadDashboard() {

  this.isLoading = true;

  this.auth.getDashboard().subscribe({

    next: (res: any) => {

      console.log("Dashboard response:", res);

      // recompute weak passwords
      const passwords = res.recentPasswords || [];

      let weakCount = 0;

      passwords.forEach((p: any) => {

        const password = p.password || '';

        const strongRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!strongRegex.test(password)) {
          weakCount++;
        }

      });

      res.weakPasswords = weakCount;

      this.data = res;

      this.isLoading = false;

      this.cdr.detectChanges();
    },

    error: (err) => {

      console.log("Dashboard error:", err);

      this.isLoading = false;

      this.cdr.detectChanges();
    }

  });

}

  get securityScore(): number {
    if (!this.data) return 0;

    const total = this.data.totalPasswords || 0;
    const weak = this.data.weakPasswords || 0;
    const reused = this.data.reusedPasswords || 0;

    if (total === 0) return 100;

    const risk = (weak + reused) / total;
    return Math.max(0, Math.round(100 - risk * 100));
  }
}