import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormArray
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {

  fixedQuestions: string[] = [
    "What is your mother's maiden name?",
    "What was your first school name?",
    "What is your favorite childhood friend name?"
  ];

  form: FormGroup;
  loading = false;
  errorMessage = '';

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      masterPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      securityAnswers: this.fb.array([
        ['', Validators.required],
        ['', Validators.required],
        ['', Validators.required]
      ])
    });
  }

  // Getter for form array
  get securityAnswers(): FormArray {
    return this.form.get('securityAnswers') as FormArray;
  }

  submit() {

  if (this.loading) return;

  this.errorMessage = '';

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  if (this.form.value.masterPassword !== this.form.value.confirmPassword) {
    this.errorMessage = 'Passwords do not match';
    return;
  }

  this.loading = true;

  const formattedSecurityAnswers = this.fixedQuestions.map(
    (question, index) => ({
      question,
      answer: this.securityAnswers.at(index).value
    })
  );

  const payload = {
    name: this.form.value.name,
    email: this.form.value.email,
    username: this.form.value.username,
    masterPassword: this.form.value.masterPassword,
    securityAnswers: formattedSecurityAnswers
  };

  this.auth.register(payload).subscribe({

    next: () => {
      alert('Registration successful');
      this.router.navigate(['/login']);
    },

    error: (err: any) => {
      this.errorMessage = err.error?.message || 'Registration failed';
    }

  }).add(() => {
    // This always runs (success or error)
    this.loading = false;
  });

}}