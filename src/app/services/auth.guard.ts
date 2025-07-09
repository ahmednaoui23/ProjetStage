import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './authservice';

export const AuthGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
// This guard checks if the user is authenticated before allowing access to certain routes.
// If not authenticated, it redirects to the login page.