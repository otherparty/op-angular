import { Routes, provideRouter, withDebugTracing } from '@angular/router';
import { FullStoryComponent } from './full-story/full-story.component';
import { ApplicationConfig } from '@angular/core';
import { StoriesComponent } from './stories/stories.component';
import { SubscribersPageComponent } from './subscribers-page/subscribers-page.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { OtpVerificationComponent } from './auth/otp-verification/otp-verification.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AboutComponent } from './about/about.component';
import { alreadyLoggedInGuard } from './auth.guard';

export const routes: Routes = [
  {
    path : '',
    component: StoriesComponent
  },
  {
    path : 'register',
    component: RegisterComponent,
    canActivate: [alreadyLoggedInGuard] // Apply the guard here
  },
  {
    path : 'login',
    component: LoginComponent,
    canActivate: [alreadyLoggedInGuard] // Apply the guard here
  },
  {
    path : 'otp-verification',
    component: OtpVerificationComponent,
    canActivate: [alreadyLoggedInGuard] // Apply the guard here
  },
  {
    path : 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [alreadyLoggedInGuard] // Apply the guard here
  },
  {
    path : 'about',
    component: AboutComponent,
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