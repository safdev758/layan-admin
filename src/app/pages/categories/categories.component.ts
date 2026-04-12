import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

// Interface for the API response
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stack">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">Categories</h2>
          <p class="page-subtitle">Organize your product inventory</p>
        </div>
        <button (click)="openAddModal()" class="btn btn-primary" style="padding:10px 20px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
          Add Category
        </button>
      </div>

      <!-- Table Card -->
      <div class="card" style="overflow:hidden;">
        <!-- Loading -->
        <div *ngIf="loading" class="spinner-container">
          <div class="spinner"></div>
        </div>

        <!-- Error -->
        <div *ngIf="error" class="alert-error" style="margin:var(--space-md);">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ error }}
        </div>

        <!-- Data -->
        <div *ngIf="!loading && !error" style="overflow-x:auto;">
          <table class="table">
            <thead>
              <tr>
                <th style="padding-left:24px;">Category</th>
                <th>Description</th>
                <th>Emoji</th>
                <th style="text-align:right; padding-right:24px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let category of categories">
                <td style="padding-left:24px;">
                  <span style="font-weight:600; color:var(--text);">{{ category.name }}</span>
                </td>
                <td style="color:var(--muted); font-size:13px; max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                  {{ category.description || 'No description' }}
                </td>
                <td>
                  <div style="width:34px; height:34px; border-radius:var(--radius-sm); background:var(--surface-2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:18px;">
                    {{ category.emoji || '📦' }}
                  </div>
                </td>
                <td style="text-align:right; padding-right:24px;">
                  <div class="row" style="justify-content:flex-end; gap:6px;">
                    <button class="icon-btn edit" (click)="openEditModal(category)" title="Edit">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    </button>
                    <button class="icon-btn delete" (click)="confirmDelete(category)" title="Delete">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty -->
        <div *ngIf="!loading && !error && categories.length === 0" class="empty-state">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="opacity:0.5;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </div>
          <h3>No categories found</h3>
          <p style="margin-bottom:var(--space-lg);">Get started by adding your first category</p>
          <button class="btn btn-primary" (click)="openAddModal()">Add Category</button>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="showAddCategoryModal || editingCategory" class="modal-backdrop">
        <div class="card modal-card" style="max-width:480px;">
          <div class="card-body">
            <div class="row" style="justify-content:space-between; align-items:center; margin-bottom:var(--space-lg);">
              <h3 style="margin:0; font-size:18px; font-weight:700; color:var(--text);">{{ editingCategory ? 'Edit' : 'Add' }} Category</h3>
              <button (click)="closeModal()" class="icon-btn" aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <form (ngSubmit)="editingCategory ? updateCategory() : createCategory()">
              <div class="stack" style="gap:var(--space-md);">
                <div class="form-field">
                  <label class="form-label">Name</label>
                  <input class="input" type="text" [(ngModel)]="currentCategory.name" name="name" required placeholder="e.g. Fruits & Vegetables" style="width:100%;" />
                </div>
                <div class="form-field">
                  <label class="form-label">Description</label>
                  <textarea class="input" rows="3" [(ngModel)]="currentCategory.description" name="description" placeholder="Optional description..." style="width:100%;"></textarea>
                </div>
                <div class="form-field">
                  <label class="form-label">Emoji</label>
                  <input class="input" style="width:100%; font-size:16px;" type="text" [(ngModel)]="currentCategory.emoji" name="emoji" placeholder="e.g. 🍎" />
                </div>
                <div class="row" style="justify-content:flex-end; gap:var(--space-sm); margin-top:var(--space-sm);">
                  <button type="button" (click)="closeModal()" class="btn btn-ghost">Cancel</button>
                  <button type="submit" class="btn btn-primary" [disabled]="!currentCategory.name">
                    {{ editingCategory ? 'Update' : 'Create' }} Category
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteConfirm" class="modal-backdrop">
        <div class="card modal-card" style="max-width:420px;">
          <div class="card-body" style="text-align:center; padding:var(--space-xl);">
            <div style="width:48px; height:48px; background:var(--error-soft); color:var(--error); border-radius:var(--radius-full); display:flex; align-items:center; justify-content:center; margin:0 auto var(--space-md);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </div>
            <h3 style="margin:0 0 8px; font-size:18px; font-weight:700; color:var(--text);">Delete Category?</h3>
            <p style="color:var(--muted); margin:0 0 var(--space-lg); font-size:14px; line-height:1.5;">
              Are you sure you want to delete <strong style="color:var(--text);">"{{ currentCategory.name }}"</strong>?<br>This action cannot be undone.
            </p>
            <div class="row" style="justify-content:center; gap:var(--space-sm);">
              <button type="button" (click)="showDeleteConfirm = false" class="btn btn-ghost" style="min-width:100px;">Cancel</button>
              <button type="button" (click)="deleteCategory()" class="btn btn-danger" style="min-width:100px;">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  // Component state
  categories: Category[] = [];
  loading = true;
  error: string | null = null;
  showAddCategoryModal = false;
  showDeleteConfirm = false;
  editingCategory: Category | null = null;
  currentCategory: Category = this.getEmptyCategory();

  // Initialize an empty category object
  private getEmptyCategory(): Category {
    return {
      id: '',
      name: '',
      description: '',
      emoji: '📦',
      imageUrl: ''
    };
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  // Load all categories
  loadCategories(): void {
    this.loading = true;
    this.error = null;

    this.http.get<ApiResponse<Category[]>>(`${environment.apiUrl}/categories`).subscribe({
      next: (response: any) => {
        // Handle both direct array and wrapped response
        this.categories = Array.isArray(response) ? response : (response?.data || []);
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to load categories. ' + (err.error?.message || 'Please try again.');
        this.loading = false;
        console.error('Error loading categories:', err);
      }
    });
  }

  // Open modal to add new category
  openAddModal(): void {
    this.currentCategory = this.getEmptyCategory();
    this.editingCategory = null;
    this.showAddCategoryModal = true;
  }

  // Open modal to edit existing category
  openEditModal(category: Category): void {
    this.currentCategory = { ...category };
    this.editingCategory = category;
    this.showAddCategoryModal = true;
  }

  // Close all modals
  closeModal(): void {
    this.showAddCategoryModal = false;
    this.editingCategory = null;
    this.showDeleteConfirm = false;
    this.currentCategory = this.getEmptyCategory();
  }

  // Create a new category
  createCategory(): void {
    if (!this.currentCategory.name) return;

    this.loading = true;
    this.http.post<ApiResponse<Category>>(`${environment.apiUrl}/categories`, this.currentCategory)
      .subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Failed to create category. ' + (err.error?.message || 'Please try again.');
          this.loading = false;
          console.error('Error creating category:', err);
        }
      });
  }

  // Update an existing category
  updateCategory(): void {
    if (!this.editingCategory || !this.currentCategory.name) return;

    this.loading = true;
    this.http.put<ApiResponse<Category>>(
      `${environment.apiUrl}/categories/${this.editingCategory.id}`,
      this.currentCategory
    ).subscribe({
      next: () => {
        this.loadCategories();
        this.closeModal();
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to update category. ' + (err.error?.message || 'Please try again.');
        this.loading = false;
        console.error('Error updating category:', err);
      }
    });
  }

  // Confirm category deletion
  confirmDelete(category: Category): void {
    this.currentCategory = { ...category };
    this.showDeleteConfirm = true;
  }

  // Delete a category
  deleteCategory(): void {
    if (!this.currentCategory?.id) return;

    this.loading = true;
    this.http.delete<ApiResponse<void>>(`${environment.apiUrl}/categories/${this.currentCategory.id}`)
      .subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          this.error = 'Failed to delete category. ' + (err.error?.message || 'Please try again.');
          this.loading = false;
          console.error('Error deleting category:', err);
        }
      });
  }
}
