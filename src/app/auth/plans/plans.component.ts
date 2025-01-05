import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticateService } from '../../../services/cognito.service';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
})
export class PlansComponent {}
