import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticateService } from '../../../services/cognito.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent {
  verifyUserForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthenticateService) {
    this.verifyUserForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  onSubmit() {
    if (this.verifyUserForm.valid) {
      this.authService.otpVerification(this.verifyUserForm.value.otp)
    } else {
      console.log('OTP is invalid');
    }
  }

  get otp() {
    return this.verifyUserForm.get('otp');
  }
}
