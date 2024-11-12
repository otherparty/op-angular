import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticateService } from '../../../services/cognito.service';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPassWordFrom: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly authService: AuthenticateService) {
    this.resetPassWordFrom = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.resetPassWordFrom.valid) {
      this.authService.resetPassword(this.resetPassWordFrom.value.email)
    } else {
      console.log('email is invalid');
    }
  }

  get email() {
    return this.resetPassWordFrom.get('email');
  }
}
