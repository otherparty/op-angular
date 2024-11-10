import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BillService } from '../../../services/bill.service';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly authService: BillService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const user = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
      this.authService.loginUser(user).subscribe({
        next: (res) => {
          console.log('User logged in successfully', res);
          localStorage.setItem('logged-in-user', JSON.stringify(res?.data));
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error logging in user', err);
        }
      })
      console.log('Login Form Submitted', this.loginForm.value);
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
