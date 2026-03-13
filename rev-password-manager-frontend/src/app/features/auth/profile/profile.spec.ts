import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {

  form: FormGroup;
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      username: [{ value: '', disabled: true }],
      createdAt: [{ value: '', disabled: true }]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  // ================= LOAD PROFILE =================

  loadProfile() {
    this.auth.getProfile().subscribe({
      next: (user: any) => {
        this.form.patchValue(user);
      }
    });
  }

  // ================= UPDATE PROFILE =================

  submit() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.auth.updateProfile(this.form.getRawValue()).subscribe({
      next: () => this.message = 'Profile updated successfully',
      error: () => this.message = 'Update failed',
      complete: () => this.loading = false
    });
  }
}