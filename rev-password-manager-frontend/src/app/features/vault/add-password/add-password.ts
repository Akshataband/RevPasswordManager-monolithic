import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-add-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-password.html',
  styleUrls: ['./add-password.scss']
})
export class AddPassword {

  form: FormGroup;
  loading = false;
  strength = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {

    this.form = this.fb.group({
      accountName: ['', Validators.required],
      website: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      category: [''],
      notes: ['']
    });
  }

  checkStrength() {

    const password = this.form.value.password;

    if (!password) return;

    this.auth.checkPasswordStrength(password)
      .subscribe((res: any) => {
        this.strength = res.strength;
      });
  }
submit() {

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  this.loading = true;

  this.auth.addPassword(this.form.value).subscribe({
    next: () => {
      this.loading = false;
      this.router.navigate(['/vault']);
    },
    error: (err) => {
      this.loading = false;
      console.log(err);
      alert(err.error?.message || 'Failed to save password');
    }
  });
}
}