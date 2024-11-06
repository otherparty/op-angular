import { Routes, provideRouter, withDebugTracing } from '@angular/router';
import { FullStoryComponent } from './full-story/full-story.component';
import { ApplicationConfig } from '@angular/core';
import { StoriesComponent } from './stories/stories.component';
import { SubscribersPageComponent } from './subscribers-page/subscribers-page.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { OtpVerificationComponent } from './auth/otp-verification/otp-verification.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path : '',
    component: StoriesComponent
  },
  {
    path : 'register',
    component: RegisterComponent
  },
  {
    path : 'login',
    component: LoginComponent
  },
  {
    path : 'otp-verification',
    component: OtpVerificationComponent
  },
  {
    path : 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path : 'story/:id',
    component: FullStoryComponent
  },
  {
    path : 'subscriber-view/:id',
    component: SubscribersPageComponent
  },
  {
    path: "**",
    redirectTo: '/'
  }
];