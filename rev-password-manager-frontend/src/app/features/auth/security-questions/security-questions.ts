import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-view-security-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinner],
  templateUrl: './security-questions.html',
  styleUrls: ['./security-questions.scss']
})
export class ViewSecurityQuestions implements OnInit {

  questions: string[] = [];
  answers: { question: string; answer: string }[] = [];

  masterPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
constructor(
  private service: AuthService,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
  this.loading = true;

  // Fixed questions (same as registration)
  this.questions = [
    'What is your first school name?',
    'What is your mother’s maiden name?',
    'What was your childhood nickname?'
  ];

  this.answers = this.questions.map(q => ({
    question: q,
    answer: ''
  }));

  this.loading = false;
}

updateQuestions() {

  this.errorMessage = '';
  this.successMessage = '';

  if (!this.masterPassword.trim()) {
    this.errorMessage = 'Master password is required';
    return;
  }

  if (this.answers.some(a => !a.answer.trim())) {
    this.errorMessage = 'All 3 answers are required';
    return;
  }

  this.loading = true;

  this.service.updateSecurityQuestions({
    masterPassword: this.masterPassword,
    questions: this.answers
  }).subscribe({
    next: () => {

      this.successMessage = 'Security questions updated successfully';

      this.masterPassword = '';
      this.answers.forEach(a => a.answer = '');

      this.loading = false;

      // ⭐ force UI refresh
      this.cdr.detectChanges();
    },

    error: () => {

      this.errorMessage = 'Update failed';
      this.loading = false;

      this.cdr.detectChanges();
    }
  });

}
}