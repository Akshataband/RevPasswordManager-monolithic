import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout implements OnInit {

  username: string = '';

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadUsername();
  }

  loadUsername() {
    const token = this.auth.getToken();

    if (!token) return;

    // Decode JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.username = payload.sub;  // usually username stored in sub
  }

  logout() {

    const token = this.auth.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.auth.logout().subscribe({
      next: () => {
        this.auth.clearToken();
        this.auth.clearTempUsername();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.auth.clearToken();
        this.auth.clearTempUsername();
        this.router.navigate(['/']);
      }
    });
  }
}