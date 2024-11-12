import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticateService } from '../../../services/cognito.service';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-create-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './create-new-password.component.html',
  styleUrl: './create-new-password.component.scss'
})
export class CreateNewPasswordComponent {
  newPasswordFrom: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthenticateService) {
    this.newPasswordFrom = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.newPasswordFrom.valid) {
      this.authService.changePassword(this.newPasswordFrom.value.otp, this.newPasswordFrom.value.password)
    } else {
      console.log('OTP is invalid');
    }
  }

  get otp() {
    return this.newPasswordFrom.get('otp');
  }
}
