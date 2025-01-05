import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticateService } from '../../../services/cognito.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthenticateService,
    private readonly router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const email = this.resetPasswordForm.value.email;

      // Check the user's status before proceeding
      this.authService
        .checkUserStatus(email, environment.UserPoolId)
        .subscribe({
          next: (status) => {
            console.log(status);
            if (status.needsInitialOtp) {
              // Navigate to the initial OTP component
              // get otp() {
              //   return this.newPasswordFrom.get('otp');
              // }
              this.authService.resendConfirmationCode(email);
              this.router.navigate(['/otp-verification'], {
                queryParams: { email },
              });
            } else if (status.needsPasswordResetOtp) {
              // Proceed with password reset flow
              this.authService.resetPassword(email).subscribe({
                next: () => {
                  console.log('Password reset OTP sent.');
                },
                error: (err) => {
                  console.error('Error sending password reset OTP:', err);
                },
              });
            } else {
              console.log('No action needed.');
            }
          },
          error: (err) => {
            console.error('Error checking user status:', err);
          },
        });
    } else {
      console.log('Email is invalid');
    }
  }

  get email() {
    return this.resetPasswordForm.get('email');
  }
}
