import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticateService } from '../../../services/cognito.service';
import {  RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;

  userPool: any;
  cognitoUser: any;
  username: string = "";

  constructor(private readonly cognito: AuthenticateService ,private readonly fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    console.log("this.loginForm.valid",this.loginForm.valid);
    
    if (this.loginForm.valid) {
     this.loading = true;
     this.cognito.login(this.loginForm.value.email, this.loginForm.value.password);
     setTimeout(() => {
      this.loading = false;
     }, 2000);
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
