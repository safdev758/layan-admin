import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, UserDto } from '../../../services/admin.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stack">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">User Management</h2>
          <p class="page-subtitle">View and manage all registered users</p>
        </div>
        <div class="filter-bar">
          <div style="position:relative; display:flex; align-items:center;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="position:absolute; left:12px; color:var(--muted); pointer-events:none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input class="input" placeholder="Search users..." [value]="q" (input)="q=$any($event.target).value" (keyup.enter)="loadUsers()" style="padding-left:34px; border:none; background:transparent; width:180px;" />
          </div>
          <div class="filter-divider"></div>
          <select class="input" style="border:none; background:transparent; padding-right:32px; cursor:pointer;" [value]="role" (change)="role=$any($event.target).value; loadUsers()">
            <option value="">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="SUPERMARKET">Supermarket</option>
            <option value="DRIVER">Driver</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button class="btn btn-primary" (click)="loadUsers()" style="padding:8px 16px; border-radius:var(--radius-sm); font-size:13px;">
            Apply
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="spinner-container">
        <div class="spinner"></div>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="alert-error">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {{ error }}
      </div>

      <!-- Table -->
      <div *ngIf="!loading && !error" class="card" style="overflow:hidden;">
        <div style="overflow-x:auto;">
          <table class="table">
            <thead>
              <tr>
                <th style="padding-left:24px;">User</th>
                <th>Role</th>
                <th>Status</th>
                <th style="text-align:right; padding-right:24px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td style="padding-left:24px;">
                  <div class="row" style="gap:14px;">
                    <div style="width:38px; height:38px; border-radius:var(--radius-md); background:var(--surface-2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--accent-from); font-weight:700; font-size:15px;">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:1px;">
                      <span style="font-weight:600; font-size:14px; color:var(--text);">{{ user.name }}</span>
                      <span style="font-size:12px; color:var(--muted);">{{ user.email }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" style="background:rgba(255,255,255,0.04); border:1px solid var(--border); color:var(--text-secondary);">
                    {{ user.role }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="user.status === 'ACTIVE' ? 'badge-green' : (user.status === 'SUSPENDED' ? 'badge-red' : 'badge-yellow')">
                    <span style="width:5px; height:5px; border-radius:50%; background:currentColor; margin-right:6px;"></span>
                    {{ user.status }}
                  </span>
                </td>
                <td style="text-align:right; padding-right:24px;">
                  <button class="btn" [disabled]="updatingUserId === user.id" (click)="toggleUserStatus(user)"
                    style="padding:6px 14px; font-size:12px; border-radius:var(--radius-sm); font-weight:600;"
                    [style.color]="user.status === 'ACTIVE' ? '#fca5a5' : '#6ee7b7'"
                    [style.background]="user.status === 'ACTIVE' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)'"
                    [style.border-color]="user.status === 'ACTIVE' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'">
                    {{ user.status === 'ACTIVE' ? 'Suspend' : 'Activate' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty -->
        <div *ngIf="users.length === 0" class="empty-state">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="opacity:0.5;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z"/></svg>
          </div>
          <h3>No users found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && pagination.pages > 1" class="pagination-bar">
        <div>
          Showing page <span style="color:var(--text); font-weight:600;">{{ pagination.page }}</span> of {{ pagination.pages }}
        </div>
        <div class="row" style="gap:8px;">
          <button class="btn btn-ghost" (click)="prev()" [disabled]="pagination.page <= 1" style="padding:8px 14px; font-size:13px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Previous
          </button>
          <button class="btn btn-ghost" (click)="next()" [disabled]="pagination.page >= pagination.pages" style="padding:8px 14px; font-size:13px;">
            Next
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UsersListComponent implements OnInit {
  users: UserDto[] = [];
  loading = true;
  error: string | null = null;
  updatingUserId: string | null = null;
  q = '';
  role = '';
  pagination = { page: 1, limit: 20, total: 0, pages: 1 } as any;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.adminService.listUsers(this.role || undefined, this.q || undefined, this.pagination.page, this.pagination.limit).subscribe({
      next: (response) => {
        this.users = response.users;
        this.pagination = response.pagination as any;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  next(): void {
    if (this.pagination.page < this.pagination.pages) {
      this.pagination.page += 1;
      this.loadUsers();
    }
  }

  prev(): void {
    if (this.pagination.page > 1) {
      this.pagination.page -= 1;
      this.loadUsers();
    }
  }

  toggleUserStatus(user: UserDto): void {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.updatingUserId = user.id;

    this.adminService.updateUserStatus(user.id, newStatus).subscribe({
      next: (response) => {
        // Update the user in the list
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = response.user;
        }
        this.updatingUserId = null;
      },
      error: (err) => {
        console.error('Error updating user status:', err);
        alert('Failed to update user status. Please try again.');
        this.updatingUserId = null;
      }
    });
  }
}
