import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-edit-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-password.html',
  styleUrls: ['./edit-password.scss']
})
export class EditPassword implements OnInit {

  form: FormGroup;
  loading = false;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {

    this.form = this.fb.group({
      accountName: ['', Validators.required],
      website: [''],
      username: ['', Validators.required],
      password: [''], // optional
      category: [''],
      notes: [''],
      favorite: [false]
    });
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  loadData() {
    this.auth.getVault().subscribe((res: any) => {
      const entry = res.find((p: any) => p.id === this.id);
      if (entry) {
        this.form.patchValue(entry);
      }
    });
  }
submit() {

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.loading = true;

  const payload: any = { ...this.form.value };

  // remove empty password
  if (!payload.password || payload.password.trim() === '') {
    delete payload.password;
  }

  this.auth.updatePassword(this.id, payload)
    .subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/vault']);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        alert(err.error?.message || 'Update failed');
      }
    });
}}