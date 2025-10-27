import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServices } from '../shared/auth/auth-services';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthServices);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isAdmin()) {
    return true;
  }
  router.navigate(['/home']);
  return false;
};
