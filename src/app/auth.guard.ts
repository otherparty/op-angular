
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticateService } from '../services/cognito.service';

export const authGuard = () => {
  const authService = inject(AuthenticateService);
  const router = inject(Router);

  if (authService.getUser()) { 
    return true; 
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const alreadyLoggedInGuard = () => {
  const authService = inject(AuthenticateService);
  const router = inject(Router);

  if (authService.getUser()) {
    // Redirect logged-in users to the home page
    router.navigate(['/']);
    return false;
  } else {
    return true;
  }
};