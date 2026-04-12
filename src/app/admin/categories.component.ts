import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, CategoryDto } from '../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  categories: CategoryDto[] = [];
  loading = false;
  error: string | null = null;

  name = '';
  description = '';

  constructor(private cats: CategoryService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.cats.list().subscribe({
      next: (list) => { this.categories = list; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Failed to load categories'; this.loading = false; }
    });
  }

  create() {
    if (!this.name.trim()) return;
    this.cats.create({ name: this.name, description: this.description || undefined }).subscribe({
      next: () => { this.name = ''; this.description = ''; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Failed to create category'; }
    });
  }

  remove(cat: CategoryDto) {
    if (!confirm(`Delete category ${cat.name}?`)) return;
    this.cats.delete(cat.id).subscribe({
      next: () => this.load(),
      error: (err) => { this.error = err?.error?.message || err?.message || 'Failed to delete category'; }
    });
  }
}
