import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillService } from '../../../services/bill.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent {
  verifyUserForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly authService: BillService, private router: Router) {
    this.verifyUserForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  onSubmit() {
    if (this.verifyUserForm.valid) {
      const localStorageUser = localStorage.getItem('registered-user')
      const user = localStorageUser;
      this.authService.verifyUser({ otp: this.verifyUserForm.value.otp, email: user }).subscribe({
        next: (res) => {
          console.log('User verified successfully', res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error verifying user', err);
        }
      })
      console.log('OTP Submitted', this.verifyUserForm.value);
    } else {
      console.log('OTP is invalid');
    }
  }

  get otp() {
    return this.verifyUserForm.get('otp');
  }
}
