import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, OrderDto } from '../../services/admin.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stack">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">Order History</h2>
          <p class="page-subtitle">Track and manage customer orders</p>
        </div>
        <div class="filter-bar">
          <span style="padding:0 8px; color:var(--muted); font-size:13px; font-weight:500;">Filter by:</span>
          <select class="input" style="border:none; background:transparent; padding-right:32px; cursor:pointer; width:140px;" [value]="status" (change)="status=$any($event.target).value; reload()">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="spinner-container">
        <div class="spinner"></div>
      </div>

      <!-- Table -->
      <div *ngIf="!loading" class="card" style="overflow:hidden;">
        <div style="overflow-x:auto;">
          <table class="table">
            <thead>
              <tr>
                <th style="padding-left:24px;">Order ID</th>
                <th>Customer</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th style="text-align:right; padding-right:24px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let o of orders">
                <td style="padding-left:24px;">
                  <span class="mono" style="color:var(--text);">#{{ o.id.substring(0, 8) }}…</span>
                </td>
                <td>
                  <div class="row" style="gap:10px;">
                    <div style="width:32px; height:32px; border-radius:var(--radius-sm); background:var(--surface-2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--muted); font-size:12px; font-weight:700;">
                      {{ (o.user?.name || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <span style="font-weight:500; font-size:13px;">{{ o.user?.name || 'Unknown User' }}</span>
                  </div>
                </td>
                <td style="font-weight:600; color:var(--text); font-size:13px;">{{ o.totalAmount | number:'1.2-2' }} DA</td>
                <td>
                  <span class="badge" [ngClass]="badgeFor(o.status)">
                    <span style="width:5px; height:5px; border-radius:50%; background:currentColor; margin-right:6px;"></span>
                    {{ o.status }}
                  </span>
                </td>
                <td style="color:var(--muted); font-size:13px;">{{ o.createdAt | date:'mediumDate' }}</td>
                <td style="text-align:right; padding-right:24px;">
                  <button class="btn btn-ghost" style="padding:6px 14px; font-size:12px; border-radius:var(--radius-sm);">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty -->
        <div *ngIf="orders.length === 0" class="empty-state">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="opacity:0.5;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12h14V7a2 2 0 00-2-2h-2"/></svg>
          </div>
          <h3>No orders found</h3>
          <p>Orders will appear here once customers make purchases</p>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && (page > 1 || orders.length >= limit)" class="pagination-bar">
        <div>
          Showing page <span style="color:var(--text); font-weight:600;">{{ page }}</span>
        </div>
        <div class="row" style="gap:8px;">
          <button class="btn btn-ghost" (click)="prev()" [disabled]="page <= 1" style="padding:8px 14px; font-size:13px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Previous
          </button>
          <button class="btn btn-ghost" (click)="next()" [disabled]="orders.length < limit" style="padding:8px 14px; font-size:13px;">
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  orders: OrderDto[] = [];
  status = '';
  page = 1;
  limit = 20;
  loading = false;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.adminService.listOrders(this.status || undefined, this.page, this.limit).subscribe({
      next: (res) => {
        this.orders = res.orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.orders = [];
        this.loading = false;
      }
    });
  }
  next(): void { if (this.orders.length >= this.limit) { this.page += 1; this.reload(); } }
  prev(): void { if (this.page > 1) { this.page -= 1; this.reload(); } }
  badgeFor(s: string) { return s === 'DELIVERED' ? 'badge-green' : (s === 'PENDING' ? 'badge-yellow' : (s === 'CANCELLED' ? 'badge-red' : 'badge-green')); }
}
