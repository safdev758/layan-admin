import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  loading = false;
  error: string | null = null;
  deactivationPeriodDays = 60;

  constructor(private settings: SettingsService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.settings.get().subscribe({
      next: (res) => { this.deactivationPeriodDays = res.deactivationPeriodDays; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Failed to load settings'; this.loading = false; }
    });
  }

  save() {
    this.loading = true;
    this.error = null;
    this.settings.set(this.deactivationPeriodDays).subscribe({
      next: () => { this.loading = false; },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Failed to save settings'; this.loading = false; }
    });
  }
}
