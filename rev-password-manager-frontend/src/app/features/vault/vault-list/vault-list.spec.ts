import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vault-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vault-list.html',
  styleUrls: ['./vault-list.scss']
})
export class VaultList implements OnInit {

  passwords: any[] = [];
  search = new FormControl('');

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPasswords();
  }

  loadPasswords() {
    this.auth.getVault().subscribe((res: any) => {
      this.passwords = res;
    });
  }

  delete(id: number) {
    if (!confirm('Are you sure?')) return;

    this.auth.deletePassword(id).subscribe(() => {
      this.loadPasswords();
    });
  }

  toggleFavorite(p: any) {

    if (p.favorite) {
      this.auth.removeFromFavorite(p.id)
        .subscribe(() => this.loadPasswords());
    } else {
      this.auth.addToFavorite(p.id)
        .subscribe(() => this.loadPasswords());
    }
  }

  onSearch() {

    if (!this.search.value) {
      this.loadPasswords();
      return;
    }

    this.auth.searchVault(this.search.value)
      .subscribe((res: any) => {
        this.passwords = res.content || res;
      });
  }

  goToAdd() {
    this.router.navigate(['/add-password']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/edit-password', id]);
  }
}