import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  title: string;
  icon: string;
  route: string;
  children?: NavItem[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.open]="sidebarOpen" [style.transform]="sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'" style="position:fixed;inset:0 auto 0 0;z-index:100;transition:transform .3s cubic-bezier(0.4, 0, 0.2, 1);">

      <!-- Brand -->
      <div class="brand" style="justify-content:flex-start; padding:0 24px; gap:14px; height:72px;">
        <img src="/logo.png" alt="Layan Logo" style="height:36px; width:auto; filter:drop-shadow(0 0 8px rgba(255,255,255,0.2));">
        <div style="display:flex; flex-direction:column; line-height:1;">
          <span style="font-size:18px; font-weight:800; letter-spacing:0.5px; background:linear-gradient(to right,#fff,#cbd5e1); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">LAYAN</span>
          <span style="font-size:9px; font-weight:700; color:rgba(255,255,255,0.7); text-transform:uppercase; letter-spacing:3px; margin-top:1px;">Admin</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav style="padding:20px 14px; display:flex; flex-direction:column; gap:4px; flex:1; overflow-y:auto;">
        <div class="nav-section-label">Menu</div>

        <ng-container *ngFor="let item of navItems">
          <a [routerLink]="item.route"
             [routerLinkActive]="'active'"
             [routerLinkActiveOptions]="{ exact: true }"
             class="nav-item"
             (click)="toggleItem(item)"
             [class.active]="isActive(item)">

            <span class="row" style="gap:12px;">
              <span class="nav-icon" [innerHTML]="item.icon"></span>
              <span class="nav-label">{{ item.title }}</span>
            </span>

            <svg *ngIf="item.children" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" [style.transform]="item.isExpanded ? 'rotate(180deg)' : 'none'" style="transition:transform .3s; opacity:0.5;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </a>

          <div *ngIf="item.children && item.isExpanded" style="padding-left:20px; margin-top:2px; display:flex; flex-direction:column; gap:2px;">
            <a *ngFor="let child of item.children" [routerLink]="child.route" class="nav-sub">
              <div style="position:absolute; left:18px; top:50%; width:4px; height:4px; border-radius:50%; background:var(--muted); transform:translateY(-50%);"></div>
              {{ child.title }}
            </a>
          </div>
        </ng-container>
      </nav>

      <!-- Footer -->
      <div style="padding:16px 20px; border-top:1px solid var(--border); flex-shrink:0;">
        <div style="display:flex; align-items:center; gap:10px; padding:8px; border-radius:var(--radius-md); background:rgba(255,255,255,0.02);">
          <div style="width:8px; height:8px; border-radius:50%; background:var(--success); box-shadow:0 0 8px rgba(16,185,129,0.4);"></div>
          <span style="font-size:12px; color:var(--muted);">System Online</span>
        </div>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div *ngIf="sidebarOpen && isMobile" (click)="toggleSidebar()" style="position:fixed; inset:0; z-index:90; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px);"></div>
  `,
  styles: [`
    :host { display: contents; }
  `]
})
export class SidebarComponent implements OnInit {
  sidebarOpen = true;
  isMobile = false;

  navItems: NavItem[] = [
    {
      title: 'Dashboard',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
      route: '/dashboard',
      isExpanded: false
    },
    {
      title: 'Users',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
      route: '/dashboard/users',
      isExpanded: false
    },
    {
      title: 'Products',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4"></path></svg>',
      route: '/dashboard/products',
      isExpanded: false
    },
    {
      title: 'Categories',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>',
      route: '/dashboard/categories',
      isExpanded: false
    },
    {
      title: 'Orders',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>',
      route: '/dashboard/orders',
      isExpanded: false
    },
    {
      title: 'Advertisements',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>',
      route: '/dashboard/advertisements',
      isExpanded: false
    },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

    // Auto-close sidebar on mobile by default
    if (this.isMobile) {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleItem(item: NavItem): void {
    if (item.children) {
      item.isExpanded = !item.isExpanded;
    }
  }

  isActive(item: NavItem): boolean {
    return this.router.isActive(item.route, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.sidebarOpen = true;
    }
  }
}
