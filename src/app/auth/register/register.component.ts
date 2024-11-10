import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillService } from '../../../services/bill.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  createAccountForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly authService: BillService, private router: Router) {
    this.createAccountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      receiveEmails: [false],
    }, { validators: [this.matchingFieldsValidator('email', 'confirmEmail'), this.matchingFieldsValidator('password', 'confirmPassword')] } as AbstractControlOptions);
  }

  onSubmit() {
    if (this.createAccountForm.valid) {
      console.log('Form Submitted', this.createAccountForm.value);
      this.authService.registerUser(this.createAccountForm.value).subscribe({
        next: (res) => {
          console.log('User registered successfully', res);
          localStorage.setItem('registered-user', res.data);
          this.router.navigate(['/otp-verification']);
        },
        error: (err) => {
          console.error('Error registering user', err);
        }
      });

    } else {
      console.log('Form is invalid');
    }
  }

  matchingFieldsValidator(controlName: string, matchingControlName: string) {
    return (formGroup: AbstractControl) => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (control && matchingControl && control.value !== matchingControl.value) {
        matchingControl.setErrors({ mismatch: true });
      } else {
        matchingControl?.setErrors(null);
      }
    };
  }

  get emailMismatch() {
    return this.createAccountForm.get('confirmEmail')?.errors?.['mismatch'];
  }

  get passwordMismatch() {
    return this.createAccountForm.get('confirmPassword')?.errors?.['mismatch'];
  }
}
