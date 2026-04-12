import { Routes, CanActivateFn, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginComponent } from './auth/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthService } from './services/auth.service';
import { OverviewComponent } from './pages/dashboard/overview/overview.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { ProductsComponent } from './pages/products/products.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { SettingsComponent } from './pages/settings/settings.component';

// Auth Guard - protects routes that require authentication and ADMIN role
const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Ensure user has ADMIN role
    const user = authService.currentUserValue;
    if (user?.role === 'ADMIN') {
      return true;
    }
    // Non-admin user - deny access and logout
    authService.logout(true);
    return false;
  }

  // Store the attempted URL for redirecting after login
  authService.redirectUrl = state.url;
  return router.createUrlTree(['/login']);
};

// Public route guard - redirects to dashboard if already logged in
const publicRouteGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  // Redirect to dashboard if already logged in
  return router.createUrlTree(['/dashboard']);
};

export const routes: Routes = [
  // Login page (public)
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicRouteGuard]
  },

  // Protected dashboard routes
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: OverviewComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'settings', component: SettingsComponent },
      {
        path: 'advertisements',
        loadComponent: () => import('./pages/advertisements/advertisements.component').then(m => m.AdvertisementsComponent)
      }
    ]
  },

  // Default redirects
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
