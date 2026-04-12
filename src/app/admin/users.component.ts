import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, UserDto } from '../services/admin.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  loading = false;
  error: string | null = null;
  users: UserDto[] = [];
  role: 'DRIVER' | 'SUPERMARKET' = 'DRIVER';
  q = '';
  page = 1;
  pages = 1;

  defaultDeactivationDays = 60;

  constructor(private admin: AdminService, private settings: SettingsService) {}

  ngOnInit(): void {
    // Load default deactivation period
    this.settings.get().subscribe({
      next: (res) => { this.defaultDeactivationDays = res.deactivationPeriodDays; },
      error: () => { this.defaultDeactivationDays = 60; }
    });
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.admin.listUsers(this.role, this.q, this.page, 20).subscribe({
      next: (res) => {
        this.users = res.users;
        this.page = res.pagination.page;
        this.pages = res.pagination.pages;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to load users';
        this.loading = false;
      }
    });
  }

  setRole(r: 'DRIVER' | 'SUPERMARKET') {
    this.role = r;
    this.page = 1;
    this.load();
  }

  search() {
    this.page = 1;
    this.load();
  }

  toggleStatus(u: UserDto) {
    const newStatus = u.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    let durationDays: number | undefined = undefined;
    if (newStatus === 'SUSPENDED') {
      const input = prompt(`Suspend for how many days?`, String(this.defaultDeactivationDays));
      const parsed = input ? parseInt(input) : NaN;
      if (!isNaN(parsed) && parsed > 0) durationDays = parsed;
      else durationDays = this.defaultDeactivationDays;
    }
    this.admin.updateUserStatus(u.id, newStatus, durationDays).subscribe({
      next: (res) => {
        u.status = res.user.status;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to update status';
      }
    });
  }
}
