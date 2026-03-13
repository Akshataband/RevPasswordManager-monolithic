import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss']
})
export class Favorites implements OnInit {

  passwords: any[] = [];

  selectedId: number | null = null;
  showModal = false;
  masterPassword = '';
  decryptedPassword = '';
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.auth.getFavorites().subscribe((res: any) => {
      this.passwords = res;
    });
  }

  removeFavorite(id: number) {
    this.auth.removeFromFavorite(id)
      .subscribe(() => this.loadFavorites());
  }

  delete(id: number) {
    if (!confirm('Delete this password?')) return;

    this.auth.deletePassword(id)
      .subscribe(() => this.loadFavorites());
  }

  goToEdit(id: number) {
    this.router.navigate(['/edit-password', id]);
  }

  // 🔐 VIEW MODAL
  openViewModal(id: number) {
    this.selectedId = id;
    this.showModal = true;
    this.masterPassword = '';
    this.decryptedPassword = '';
    this.errorMessage = '';
  }

  closeModal() {
    this.showModal = false;
  }

  confirmView() {

    if (!this.masterPassword) return;

    this.auth.viewPassword(this.selectedId!, this.masterPassword)
      .subscribe({
        next: (res: any) => {
          this.decryptedPassword = res;
        },
        error: (err) => {
          this.errorMessage =
            err.error?.message || 'Invalid master password';
        }
      });
  }
}