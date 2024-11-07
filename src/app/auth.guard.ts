
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BillService } from '../services/bill.service'; // Ensure you have an AuthService handling login status

export const authGuard = () => {
  const authService = inject(BillService);
  const router = inject(Router);

  if (authService.isAuthenticated()) { // Check if the user is logged in
    return true; // Allow access
  } else {
    router.navigate(['/login']); // Redirect to login page if not authenticated
    return false;
  }
};
