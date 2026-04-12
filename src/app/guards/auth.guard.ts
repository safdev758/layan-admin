import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
class AuthGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}

export const AuthGuard: CanActivateFn = (): boolean => {
  return inject(AuthService).isLoggedIn();
};

export const AuthGuardWithRedirect: CanActivateFn = (): boolean => {
  const router = inject(Router);
  const isLoggedIn = inject(AuthService).isLoggedIn();
  
  if (!isLoggedIn) {
    router.navigate(['/auth/login']);
    return false;
  }
  
  return true;
};
