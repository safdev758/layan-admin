import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, interval } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  public redirectUrl: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const userJson = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      userJson ? JSON.parse(userJson) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
    
    // Check token expiration every minute
    interval(60000).subscribe(() => {
      this.checkTokenExpiration();
    });
    
    // Initial check
    this.checkTokenExpiration();
  }

  private checkTokenExpiration(): void {
    const token = this.token;
    if (!token) return;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.logout(true);
        return;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        console.warn('Token has expired. Logging out...');
        this.logout(true);
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
      this.logout(true);
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap(res => {
          // Only allow ADMIN role to access dashboard
          if (res.user?.role !== 'ADMIN') {
            throw new Error('Access denied. Admin role required.');
          }
          this.setAuthData(res);
        }),
        catchError(error => {
          this.clearAuthData();
          throw error;
        })
      );
  }

  logout(redirectToLogin: boolean = true): void {
    this.clearAuthData();
    if (redirectToLogin) {
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    return !!this.token && !!this.currentUserValue;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  private setAuthData(authData: AuthResponse): void {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('currentUser', JSON.stringify(authData.user));
    this.currentUserSubject.next(authData.user);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // Check if the current user has the required role
  hasRole(requiredRole: string): boolean {
    const user = this.currentUserValue;
    return user?.role === requiredRole;
  }

  // Auto login if token exists - validates token structure
  autoLogin(): boolean {
    const token = this.token;
    if (!token) return false;
    
    // Basic JWT token validation
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.clearAuthData();
        return false;
      }
      
      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        // Token expired
        this.clearAuthData();
        return false;
      }
      
      // Check if we have a valid user in local storage
      const user = localStorage.getItem('currentUser');
      if (user) {
        const parsedUser = JSON.parse(user);
        // Ensure only ADMIN role can access
        if (parsedUser.role !== 'ADMIN') {
          this.clearAuthData();
          return false;
        }
        this.currentUserSubject.next(parsedUser);
        return true;
      }
    } catch (error) {
      this.clearAuthData();
      return false;
    }
    
    return false;
  }

  // Handle 401 Unauthorized responses
  handleUnauthorized(): void {
    this.logout(true);
  }
}
