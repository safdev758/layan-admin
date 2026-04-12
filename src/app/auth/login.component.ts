import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;
  showPassword = false;
  rememberMe = false;

  constructor(
    @Inject(AuthService) private auth: AuthService, 
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async submit() {
    this.loading = true;
    this.error = null;
    try {
      await this.auth.login(this.email, this.password).toPromise();
      
      // Handle remember me
      if (this.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      // Redirect to dashboard after successful login
      const redirectUrl = this.auth.redirectUrl || '/dashboard';
      this.auth.redirectUrl = null;
      this.router.navigateByUrl(redirectUrl);
    } catch (e: any) {
      const msg = String(e?.error?.message || e?.message || 'Invalid email or password. Please try again.');
      this.error = msg;
    } finally {
      this.loading = false;
    }
  }
}
