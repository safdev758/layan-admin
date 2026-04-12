import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <!-- Breadcrumbs -->
      <nav style="display:flex; align-items:center; gap:6px; font-size:13px; font-weight:500;">
        <span style="color:var(--muted);">Dashboard</span>
        <svg *ngIf="currentPageTitle" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="color:var(--border-strong);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        <span *ngIf="currentPageTitle" style="color:var(--text);">{{ currentPageTitle }}</span>
      </nav>

      <!-- Right actions -->
      <div class="row" style="gap:8px;">

        <!-- Profile -->
        <div style="position:relative;">
          <button (click)="toggleProfileMenu()" class="profile-trigger" style="display:flex; align-items:center; gap:10px; padding:5px 10px 5px 5px; border-radius:var(--radius-md); border:1px solid var(--border); background:transparent; cursor:pointer; transition:all var(--duration-normal) var(--ease-out);">
            <div style="width:34px; height:34px; border-radius:var(--radius-sm); background:var(--accent-gradient); display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(249,115,22,0.25);">
              <span style="color:#fff; font-weight:700; font-size:13px;">{{ (user?.name || 'U').charAt(0).toUpperCase() }}</span>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-start;">
              <span style="font-size:13px; font-weight:600; color:var(--text); line-height:1.2;">{{ user?.name || 'User' }}</span>
              <span style="font-size:11px; color:var(--muted); line-height:1.2;">Admin</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="color:var(--muted); margin-left:2px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>

          <!-- Dropdown -->
          <div *ngIf="isProfileMenuOpen" class="card" style="position:absolute; right:0; top:calc(100% + 8px); width:220px; padding:6px; z-index:1000; animation:scaleIn 0.2s var(--ease-spring); transform-origin:top right;">
            <div style="padding:10px 12px; border-bottom:1px solid var(--border); margin-bottom:4px;">
              <div style="font-size:12px; font-weight:600; color:var(--text);">Signed in as</div>
              <div style="font-size:12px; color:var(--muted); text-overflow:ellipsis; overflow:hidden; white-space:nowrap; margin-top:2px;">{{ user?.email || 'user&#64;example.com' }}</div>
            </div>

            <button (click)="navigateSettings()" style="display:flex; align-items:center; gap:10px; width:100%; padding:9px 12px; border-radius:var(--radius-sm); border:none; background:transparent; color:var(--text-secondary); font-size:13px; font-family:inherit; cursor:pointer; transition:background var(--duration-fast) var(--ease-out);"
              onmouseenter="this.style.background='rgba(255,255,255,0.04)'" onmouseleave="this.style.background='transparent'">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Settings
            </button>

            <button (click)="logout()" style="display:flex; align-items:center; gap:10px; width:100%; padding:9px 12px; border-radius:var(--radius-sm); border:none; background:transparent; color:var(--error); font-size:13px; font-family:inherit; cursor:pointer; transition:background var(--duration-fast) var(--ease-out);"
              onmouseenter="this.style.background='rgba(239,68,68,0.06)'" onmouseleave="this.style.background='transparent'">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host { display: contents; }
    .profile-trigger:hover {
      background: rgba(255, 255, 255, 0.04) !important;
      border-color: var(--border-strong) !important;
    }
  `]
})
export class HeaderComponent implements OnInit {
  isProfileMenuOpen = false;
  user: any;
  currentPageTitle = '';

  private routeTitleMap: Record<string, string> = {
    '/dashboard': '',
    '/dashboard/users': 'Users',
    '/dashboard/products': 'Products',
    '/dashboard/categories': 'Categories',
    '/dashboard/orders': 'Orders',
    '/dashboard/settings': 'Settings',
    '/dashboard/advertisements': 'Advertisements',
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.updatePageTitle(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updatePageTitle(event.urlAfterRedirects || event.url);
      });
  }

  private updatePageTitle(url: string): void {
    this.currentPageTitle = this.routeTitleMap[url] ?? '';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.isProfileMenuOpen && !target.closest('.profile-trigger') && !target.closest('.card')) {
      this.isProfileMenuOpen = false;
    }
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  navigateSettings(): void {
    this.isProfileMenuOpen = false;
    this.router.navigate(['/dashboard/settings']);
  }

  logout(): void {
    this.authService.logout();
    this.isProfileMenuOpen = false;
  }
}
