import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticateService } from '../../../services/cognito.service';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { BillService } from '../../../services/bill.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;

  userPool: any;
  cognitoUser: any;
  username: string = '';

  constructor(
    private readonly cognito: AuthenticateService,
    private readonly auth: BillService,
    private readonly fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.cognito
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .then((data: any) => {
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          this.cognito.getIdToken().then((idToken) => {
            if (idToken) {
              const decoded = this.parseJwt(idToken);
              const cognitoUsername = decoded['cognito:username'];
              // console.log('Cognito Username', cognitoUsername)
              this.auth.checkForUserSubscription(idToken).subscribe((data) => {
                if (data?.data?.subscriptionStatus) {
                  if (data?.data?.amount > 3) {
                    this.cognito.updateSubscriptionAttribute(
                      'Lincoln',
                      this.loginForm.value.email
                    );
                  } else if (data?.data?.amount > 1) {
                    this.cognito.updateSubscriptionAttribute(
                      'Jefferson',
                      this.loginForm.value.email
                    );
                  } else {
                    this.cognito.updateSubscriptionAttribute(
                      'Commons',
                      this.loginForm.value.email
                    );
                  }
                } else {
                  this.cognito.updateSubscriptionAttribute(
                    'Commons',
                    this.loginForm.value.email
                  );
                }
              });
            } else {
              console.error('User is not authenticated.');
            }
          });
        })
        .catch((error: any) => {
          console.log(
            '🚀 ~ file: login.component.ts:63 ~ LoginComponent ~ ).then ~ error:',
            error
          );
        });

      // this.cognito.getUserSubscriptions().then(subscription$ => {
      //   subscription$.subscribe({
      //     next: (data) => {
      //       console.log('Subscription Data:', data);
      //       if (data?.data?.subscriptionStatus) {
      //         if (data?.data?.amount > 3) {
      //           this.cognito.updateSubscriptionAttribute("Lincoln", this.loginForm.value.email);
      //         } else if (data?.data?.amount > 1) {
      //           this.cognito.updateSubscriptionAttribute("Jefferson", this.loginForm.value.email);
      //         } else {
      //           this.cognito.updateSubscriptionAttribute("Commons", this.loginForm.value.email);
      //         }
      //       }
      //     },
      //     error: (error) => {
      //       console.error('Subscription API Error:', error);
      //     },
      //     complete: () => {
      //       console.log('Subscription completed.');
      //     }
      //   });
      // }).catch((error) => {
      //   console.error('Error calling getUserSubscriptions:', error);
      // });
    } else {
      console.log('Form is invalid');
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
