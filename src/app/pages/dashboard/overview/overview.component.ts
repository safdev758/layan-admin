import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardService, DashboardStats } from '../../../services/dashboard.service';
import { AdminService, OrderDto } from '../../../services/admin.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="stack" style="gap:28px;">

      <!-- Loading State -->
      <div *ngIf="loading" class="spinner-container">
        <div class="spinner"></div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="alert-error">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {{ error }}
      </div>

      <ng-container *ngIf="!loading && stats">

        <!-- ── Stat Cards ── -->
        <div class="grid" style="grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px;">

          <!-- Revenue -->
          <div class="card stat-card">
            <div class="card-body" style="padding:20px;">
              <div class="row" style="gap:14px; margin-bottom:14px;">
                <div class="stat-icon" style="background:var(--success-soft); color:var(--success);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <span class="card-title" style="margin:0;">Total Revenue</span>
              </div>
              <div class="card-value" style="font-size:26px;">{{ stats.totalRevenue | number:'1.0-0' }} <small style="font-size:13px; opacity:0.6;">DA</small></div>
              <div style="margin-top:10px; font-size:12px; color:var(--success); display:flex; align-items:center; gap:4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                +12.5% vs last month
              </div>
            </div>
          </div>

          <!-- Orders -->
          <div class="card stat-card">
            <div class="card-body" style="padding:20px;">
              <div class="row" style="gap:14px; margin-bottom:14px;">
                <div class="stat-icon" style="background:var(--warning-soft); color:var(--warning);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                </div>
                <span class="card-title" style="margin:0;">Total Orders</span>
              </div>
              <div class="card-value" style="font-size:26px;">{{ stats.totalOrders | number }}</div>
              <div style="margin-top:10px; font-size:12px; color:var(--muted);">
                <span style="color:var(--warning); font-weight:600;">{{ stats.pendingOrders }} pending</span> processing
              </div>
            </div>
          </div>

          <!-- Customers -->
          <div class="card stat-card">
            <div class="card-body" style="padding:20px;">
              <div class="row" style="gap:14px; margin-bottom:14px;">
                <div class="stat-icon" style="background:var(--info-soft); color:var(--info);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z"/></svg>
                </div>
                <span class="card-title" style="margin:0;">Customers</span>
              </div>
              <div class="card-value" style="font-size:26px;">{{ stats.totalUsers | number }}</div>
              <div style="margin-top:10px; font-size:12px; color:var(--success);">{{ stats.activeUsers }} currently active</div>
            </div>
          </div>

          <!-- Products -->
          <div class="card stat-card">
            <div class="card-body" style="padding:20px;">
              <div class="row" style="gap:14px; margin-bottom:14px;">
                <div class="stat-icon" style="background:rgba(139,92,246,0.1); color:#a78bfa;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4v10l8 4 8-4z"/></svg>
                </div>
                <span class="card-title" style="margin:0;">Products</span>
              </div>
              <div class="card-value" style="font-size:26px;">{{ stats.totalProducts | number }}</div>
              <div style="margin-top:10px; font-size:12px; color:var(--muted);">Across all categories</div>
            </div>
          </div>
        </div>

        <!-- ── Middle Section ── -->
        <div class="grid" style="grid-template-columns:2fr 1fr; gap:24px;">

          <!-- Sales Chart -->
          <div class="card">
            <div class="card-body">
              <div class="row" style="justify-content:space-between; align-items:center; margin-bottom:24px;">
                <div>
                  <h3 style="margin:0; font-size:16px; font-weight:600; color:var(--text);">Sales Analytics</h3>
                  <p style="margin:4px 0 0; font-size:13px; color:var(--muted);">Order volume over the last {{ selectedDays }} days</p>
                </div>
                <select class="input" style="padding:6px 32px 6px 12px; font-size:12px; border-radius:var(--radius-sm);" [(ngModel)]="selectedDays" (ngModelChange)="onPeriodChange()">
                  <option [ngValue]="7">Last 7 Days</option>
                  <option [ngValue]="30">Last 30 Days</option>
                </select>
              </div>

              <div style="height:200px; position:relative; margin-top:12px;">
                <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  <line x1="0" y1="50" x2="1000" y2="50" stroke="var(--border)" stroke-width="1" />
                  <line x1="0" y1="100" x2="1000" y2="100" stroke="var(--border)" stroke-width="1" />
                  <line x1="0" y1="150" x2="1000" y2="150" stroke="var(--border)" stroke-width="1" />
                  <path [attr.d]="getAreaPath()" fill="url(#gradient-area)" opacity="0.12" />
                  <path [attr.d]="getTrendPath()" fill="none" stroke="var(--accent-from)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                  <circle *ngFor="let dot of getTrendDots()" [attr.cx]="dot.x" [attr.cy]="dot.y" r="3.5" fill="var(--accent-from)" stroke="var(--surface)" stroke-width="2" />
                  <defs>
                    <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="var(--accent-from)" />
                      <stop offset="100%" stop-color="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style="display:flex; justify-content:space-between; margin-top:12px; padding:0 8px;">
                  <span *ngFor="let label of getXLabels()" style="font-size:11px; color:var(--muted);">{{ label }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <div class="card-body">
              <h3 style="margin:0 0 20px; font-size:16px; font-weight:600; color:var(--text);">Quick Actions</h3>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <a routerLink="/dashboard/products" class="nav-item" style="text-decoration:none; border:1px solid var(--border);">
                  <span class="row" style="gap:12px;">
                    <span class="stat-icon" style="width:34px; height:34px; background:var(--success-soft); color:var(--success);">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    </span>
                    <span class="nav-label">Add New Product</span>
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="opacity:0.4;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </a>
                <a routerLink="/dashboard/orders" class="nav-item" style="text-decoration:none; border:1px solid var(--border);">
                  <span class="row" style="gap:12px;">
                    <span class="stat-icon" style="width:34px; height:34px; background:var(--warning-soft); color:var(--warning);">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    </span>
                    <span class="nav-label">View All Orders</span>
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="opacity:0.4;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </a>
                <a routerLink="/dashboard/users" class="nav-item" style="text-decoration:none; border:1px solid var(--border);">
                  <span class="row" style="gap:12px;">
                    <span class="stat-icon" style="width:34px; height:34px; background:var(--info-soft); color:var(--info);">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </span>
                    <span class="nav-label">Manage Users</span>
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="opacity:0.4;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- ── Recent Orders Table ── -->
        <div class="card">
          <div class="card-body" style="padding:0;">
            <div style="padding:20px 24px; border-bottom:1px solid var(--border);">
              <div class="row" style="justify-content:space-between;">
                <div>
                  <h3 style="margin:0; font-size:16px; font-weight:600; color:var(--text);">Recent Orders</h3>
                  <p style="margin:4px 0 0; font-size:13px; color:var(--muted);">Latest transactions across the platform</p>
                </div>
                <a routerLink="/dashboard/orders" class="btn btn-ghost" style="font-size:13px; padding:8px 14px;">
                  View All
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>

            <div style="overflow-x:auto;">
              <table class="table">
                <thead>
                  <tr>
                    <th style="padding-left:24px;">Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style="text-align:right; padding-right:24px;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let order of recentOrders">
                    <td style="padding-left:24px;">
                      <span class="mono" style="color:var(--accent-from);">#{{ order.id.substring(0, 8).toUpperCase() }}</span>
                    </td>
                    <td>
                      <div class="row" style="gap:10px;">
                        <div style="width:30px; height:30px; border-radius:var(--radius-sm); background:var(--surface-2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:var(--text-secondary);">
                          {{ (order.user?.name || 'C').charAt(0) }}
                        </div>
                        <span style="font-size:13px; font-weight:500;">{{ order.user?.name || 'Unknown' }}</span>
                      </div>
                    </td>
                    <td style="font-size:13px; color:var(--muted);">{{ order.createdAt | date:'short' }}</td>
                    <td style="font-weight:600; font-size:13px;">{{ order.totalAmount | number:'1.0-0' }} DA</td>
                    <td>
                      <span class="badge" [class.badge-yellow]="order.status==='PENDING'" [class.badge-green]="order.status==='DELIVERED' || order.status==='COMPLETED'" [class.badge-red]="order.status==='CANCELLED'">
                        {{ order.status }}
                      </span>
                    </td>
                    <td style="text-align:right; padding-right:24px;">
                      <button class="icon-btn" title="View details">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="recentOrders.length === 0">
                    <td colspan="6" style="text-align:center; padding:48px; color:var(--muted);">No recent orders found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    @media (max-width: 900px) {
      :host ::ng-deep .grid[style*="2fr 1fr"] {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class OverviewComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentOrders: OrderDto[] = [];
  loading = true;
  error: string | null = null;
  selectedDays = 7;

  constructor(
    private dashboardService: DashboardService,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  onPeriodChange(): void {
    this.loadStats();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      stats: this.dashboardService.getStats(this.selectedDays),
      orders: this.adminService.listOrders(undefined, 1, 5)
    }).subscribe({
      next: (results) => {
        this.stats = results.stats;
        this.recentOrders = results.orders.orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data. Please check your connection.';
        this.loading = false;
        console.error('Error loading dashboard data:', err);
      }
    });
  }

  /** Re-fetch only the stats (not orders) when the period changes */
  loadStats(): void {
    this.dashboardService.getStats(this.selectedDays).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Error refreshing stats:', err);
      }
    });
  }

  getTrendPath(): string {
    if (!this.stats?.salesTrend || this.stats.salesTrend.length === 0) {
      return 'M0,180 L1000,180';
    }

    const trend = this.stats.salesTrend;
    const maxRevenue = Math.max(...trend.map(t => t.revenue), 1);
    const width = 1000;
    const height = 180;
    const step = width / (Math.max(trend.length - 1, 1));

    return trend.map((t, i) => {
      const x = i * step;
      const y = height - (t.revenue / maxRevenue * height) + 10;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  }

  getAreaPath(): string {
    const linePath = this.getTrendPath();
    if (linePath.startsWith('M0,180')) return linePath;
    return `${linePath} L1000,200 L0,200 Z`;
  }

  /** Compute dot positions from salesTrend data */
  getTrendDots(): { x: number; y: number }[] {
    if (!this.stats?.salesTrend || this.stats.salesTrend.length === 0) return [];

    const trend = this.stats.salesTrend;
    const maxRevenue = Math.max(...trend.map(t => t.revenue), 1);
    const width = 1000;
    const height = 180;
    const step = width / (Math.max(trend.length - 1, 1));

    return trend.map((t, i) => ({
      x: i * step,
      y: height - (t.revenue / maxRevenue * height) + 10
    }));
  }

  /** Build X-axis labels based on salesTrend data and selected period */
  getXLabels(): string[] {
    if (!this.stats?.salesTrend || this.stats.salesTrend.length === 0) return [];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trend = this.stats.salesTrend;

    if (this.selectedDays <= 7) {
      // Show day-of-week names
      return trend.map(t => {
        const d = new Date(t.day);
        return dayNames[d.getDay()];
      });
    } else {
      // For 30 days, show short date labels (show every ~5th label to avoid crowding)
      return trend.map((t, i) => {
        const d = new Date(t.day);
        if (trend.length <= 10 || i % Math.ceil(trend.length / 8) === 0 || i === trend.length - 1) {
          return `${d.getDate()}/${d.getMonth() + 1}`;
        }
        return '';
      });
    }
  }
}
