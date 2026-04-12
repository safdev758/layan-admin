import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stack" style="max-width:720px;">
      <div class="page-header">
        <div>
          <h2 class="page-title">System Settings</h2>
          <p class="page-subtitle">Configure platform defaults and policies</p>
        </div>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="alert-error">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        {{ error }}
      </div>

      <!-- Deactivation Policy Card -->
      <div class="card">
        <div class="card-body" style="display:flex; flex-direction:column; gap:var(--space-lg);">
          <!-- Card Header -->
          <div style="display:flex; align-items:center; gap:var(--space-md);">
            <div class="stat-icon" style="background:rgba(249,115,22,0.1); color:var(--accent-from);">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
              <h3 style="margin:0; font-size:16px; font-weight:600; color:var(--text);">User Deactivation Policy</h3>
              <p style="margin:2px 0 0; font-size:13px; color:var(--muted);">Default suspension duration applied when an account is deactivated.</p>
            </div>
          </div>

          <!-- Divider -->
          <div style="height:1px; background:var(--border);"></div>

          <!-- Form -->
          <div style="display:grid; grid-template-columns:1fr auto; gap:var(--space-lg); align-items:end;">
            <div class="form-field">
              <label class="form-label">Default deactivation period (days)</label>
              <input type="number" class="input" style="width:100%;"
                     [(ngModel)]="deactivationPeriodDays" min="1" max="3650"
                     placeholder="e.g. 60" />
              <span style="font-size:12px; color:var(--muted); margin-top:2px;">Allowed range: 1 – 3650 days</span>
            </div>

            <div class="row" style="gap:var(--space-sm);">
              <button (click)="load()" [disabled]="loading" class="btn btn-ghost" style="padding:10px 16px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Reload
              </button>
              <button (click)="save()" [disabled]="loading" class="btn btn-primary" style="padding:10px 20px;">
                <svg *ngIf="!loading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span *ngIf="loading" class="spinner" style="width:16px; height:16px; border-width:2px;"></span>
                {{ loading ? 'Saving…' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional info card -->
      <div class="card" style="border-color:rgba(59,130,246,0.15); background:rgba(59,130,246,0.03);">
        <div class="card-body" style="display:flex; align-items:flex-start; gap:var(--space-md); padding:var(--space-md) var(--space-lg);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="color:var(--info); flex-shrink:0; margin-top:2px;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <p style="margin:0; font-size:13px; color:var(--text-secondary); line-height:1.6;">
            Deactivated users will be automatically suspended for the configured period. They can be manually reactivated from the
            <strong style="color:var(--text);">Users</strong> page at any time.
          </p>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  loading = false;
  error: string | null = null;
  deactivationPeriodDays = 60;

  constructor(private settings: SettingsService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.settings.get().subscribe({
      next: (res) => {
        this.deactivationPeriodDays = res.deactivationPeriodDays;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to load settings';
        this.loading = false;
      }
    });
  }

  save(): void {
    this.loading = true;
    this.error = null;
    this.settings.set(this.deactivationPeriodDays).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to save settings';
        this.loading = false;
      }
    });
  }
}
