import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ViewPasswordModal } from '../../../shared/components/view-password-modal/view-password-modal';
import { ChangeDetectorRef } from '@angular/core'; 

@Component({
  selector: 'app-vault-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinner,
    ConfirmDialog,
    ViewPasswordModal
  ],
  templateUrl: './vault-list.html',
  styleUrls: ['./vault-list.scss']
})
export class VaultList implements OnInit {

  passwords: any[] = [];

  search = '';
  category = '';
  sortBy = 'createdAt';
  direction: 'asc' | 'desc' = 'desc';

  page = 0;
  size = 5;

  totalPages = 0;
  totalElements = 0;

  loading = true;
  showFavorites = false;

  deleteId: number | null = null;
  selectedId: number | null = null;

  categories = [
    'Social Media',
    'Banking',
    'Email',
    'Shopping',
    'Work',
    'Other'
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadPasswords();
  }

  trackById(index: number, item: any) {
    return item.id;
  }
  // ================= LOAD =================
  loadPasswords() {

    this.loading = true;   // FIX: removed early return

    // FAVORITES MODE
    if (this.showFavorites) {
      this.auth.getFavorites().subscribe({
        next: (res: any[]) => {
  this.passwords = res || [];
  this.totalPages = 0;
  this.totalElements = this.passwords.length;
  this.loading = false;

  this.cdr.detectChanges(); // ADDED: force UI refresh
},
        error: () => {
          this.loading = false;
        }
      });
      return;
    }

    // NORMAL MODE
    const params: any = {
      page: this.page,
      size: this.size,
      sortBy: this.sortBy,
      direction: this.direction
    };

    if (this.search?.trim()) {
      params.search = this.search.trim();
    }

    if (this.category?.trim()) {
      params.category = this.category.trim();
    }

    this.auth.searchVault(params).subscribe({
      next: (res: any) => {
  this.passwords = res?.content || [];
  this.totalPages = res?.totalPages || 0;
  this.totalElements = res?.totalElements || 0;
  this.page = res?.number || 0;
  this.loading = false;

  this.cdr.detectChanges(); 
},
      error: () => {
        this.loading = false;
      }
    });
  }

  // ================= TOGGLE FAVORITES VIEW =================
  toggleShowFavorites() {

    this.showFavorites = !this.showFavorites;

    this.page = 0;

    this.passwords = [];
    this.loading = true;

    this.loadPasswords();
  }

  applyFilters() {
    this.page = 0;
    this.loadPasswords();
  }

  changeSort(field: string) {
    if (this.sortBy === field) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.direction = 'asc';
    }
    this.loadPasswords();
  }

  // ================= TOGGLE FAVORITE =================
  toggleFavorite(item: any) {

    if (item.loading) return;

    item.loading = true;

    const request$ = item.favorite
      ? this.auth.removeFromFavorite(item.id)
      : this.auth.addToFavorite(item.id);

    request$.subscribe({
      next: () => {
        item.favorite = !item.favorite;
item.loading = false;

this.cdr.detectChanges(); 

        if (this.showFavorites && !item.favorite) {
          this.passwords = this.passwords.filter(p => p.id !== item.id);
        }
      },
      error: () => {
        item.loading = false;
      }
    });
  }

  confirmDelete(id: number) {
    this.deleteId = id;
  }

  deletePassword() {

    if (this.loading) return;

    if (!this.deleteId) return;

    this.loading = true;

    this.auth.deletePassword(this.deleteId).subscribe(() => {
      this.loadPasswords();
      this.deleteId = null;
      this.loading = false;
    });

  }
  goToAdd() {
    this.router.navigate(['/add-password']);
  }

  editPassword(id: number) {
    this.router.navigate(['/edit-password', id]);
  }

  viewPassword(id: number) {
    this.selectedId = id;
  }

  closeModal() {
    this.selectedId = null;
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadPasswords();
    }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadPasswords();
    }
  }

  goToPage(p: number) {
    this.page = p;
    this.loadPasswords();
  }

  get pageNumbers(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }
}