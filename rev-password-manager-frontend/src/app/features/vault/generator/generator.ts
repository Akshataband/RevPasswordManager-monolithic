import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generator.html',
  styleUrls: ['./generator.scss']
})
export class Generator {
  loading = false; 
passwords: { password: string; strength: string }[] = []; 
  strength = '';
  form!: FormGroup;

  constructor(
  private fb: FormBuilder,
  private auth: AuthService,
  private cdr: ChangeDetectorRef
) {
    this.form = this.fb.group({
      length: [12],
      count: [1],
      includeUppercase: [true],
      includeLowercase: [true],
      includeNumbers: [true],
      includeSpecial: [true],
      excludeSimilar: [false] 
    });
  }

  generate() {

  if (this.loading) return;

  this.loading = true;

  this.auth.generatePasswords(this.form.value)
    .subscribe({
      next: (res: any) => {

        console.log("Generated passwords:", res);

        // Force Angular to detect changes
        this.passwords = [...res];

        this.loading = false;

        this.cdr.detectChanges();

      },
      error: () => {

        this.loading = false;

        this.cdr.detectChanges();

      }
    });

}
  copy(password: string) {
    navigator.clipboard.writeText(password);
    alert('Copied to clipboard');
  }

  save(password: string) {

  if (this.loading) return;

  this.loading = true; 

  const payload = {
    accountName: 'Generated Account',
    website: '',
    username: '',
    password: password,
    category: 'Generated',
    notes: ''
  };

  this.auth.saveGeneratedPassword(payload)
    .subscribe({
      next: () => {
        alert('Saved to vault');
        this.loading = false; 
      },
      error: () => {
        this.loading = false;
      }
    });

}
}