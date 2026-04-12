import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, ProductsResponse } from '../../services/product.service';
import { CategoryService, CategoryDto } from '../../services/category.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="stack">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h2 class="page-title">Products</h2>
          <p class="page-subtitle">Manage your store inventory</p>
        </div>
        <div class="row" style="gap:8px; flex-wrap:wrap;">
          <div class="filter-bar" style="gap:6px;">
            <div style="position:relative; display:flex; align-items:center;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="position:absolute; left:12px; color:var(--muted); pointer-events:none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input class="input" placeholder="Search products..." [(ngModel)]="q" (keyup.enter)="reload()" style="padding-left:34px; border:none; background:transparent; width:180px;" />
            </div>
            <button (click)="reload()" class="btn btn-primary" style="padding:8px 16px; font-size:13px;">Search</button>
          </div>
          <button (click)="openAdd()" class="btn btn-primary" style="padding:10px 20px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            Add Product
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

      <!-- Products Table -->
      <div *ngIf="!loading && products.length" class="card" style="overflow:hidden;">
        <div style="overflow-x:auto;">
          <table class="table">
            <thead>
              <tr>
                <th style="padding-left:24px;">Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Weight</th>
                <th style="text-align:right; padding-right:24px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of products">
                <td style="padding-left:24px;">
                  <div style="width:42px; height:42px; border-radius:var(--radius-sm); overflow:hidden; background:var(--surface-2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center;">
                    <img *ngIf="p.image" [src]="p.image" alt="product" style="width:100%; height:100%; object-fit:cover;" />
                    <svg *ngIf="!p.image" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="opacity:0.3;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                </td>
                <td style="font-weight:500; color:var(--text);">{{ p.name }}</td>
                <td style="color:var(--muted); font-size:13px;">{{ p.brand || '—' }}</td>
                <td>
                  <span class="badge" style="background:rgba(255,255,255,0.04); border:1px solid var(--border); color:var(--text-secondary);">
                    {{ p.category?.name || p.categoryId }}
                  </span>
                </td>
                <td style="color:var(--muted); font-size:13px;">{{ p.weight || '—' }}</td>
                <td style="text-align:right; padding-right:24px;">
                  <button class="icon-btn edit" (click)="openEdit(p)" title="Edit">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty -->
      <div *ngIf="!loading && !products.length" class="card">
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="opacity:0.5;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4v10l8 4 8-4z"/></svg>
          </div>
          <h3>No products found</h3>
          <p>Try a different search or add a new product</p>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="!loading && pagination.pages > 1" class="pagination-bar">
        <span>Page <strong style="color:var(--text);">{{ pagination.page }}</strong> / {{ pagination.pages }}</span>
        <div class="row" style="gap:8px;">
          <button (click)="prev()" [disabled]="pagination.page <= 1" class="btn btn-ghost" style="padding:8px 14px; font-size:13px;">Prev</button>
          <button (click)="next()" [disabled]="pagination.page >= pagination.pages" class="btn btn-ghost" style="padding:8px 14px; font-size:13px;">Next</button>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="showModal" class="modal-backdrop">
        <div class="card modal-card" style="max-width:520px;">
          <div class="card-body">
            <div class="row" style="justify-content:space-between; align-items:center; margin-bottom:var(--space-lg);">
              <h3 style="margin:0; font-size:18px; font-weight:700; color:var(--text);">{{ editing ? 'Edit' : 'Add' }} Product</h3>
              <button (click)="closeModal()" class="icon-btn" aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div class="stack" style="gap:var(--space-md);">
              <div class="form-field">
                <label class="form-label">Name</label>
                <input class="input" [(ngModel)]="form.name" name="name" style="width:100%;" />
              </div>
              <div class="form-field">
                <label class="form-label">Image</label>
                <input type="file" accept="image/*" (change)="onImageSelected($event)" class="input" style="width:100%;" />
                <div *ngIf="form.image" style="margin-top:8px;">
                  <img [src]="form.image" alt="preview" style="max-width:120px; border-radius:var(--radius-sm); border:1px solid var(--border);" />
                </div>
              </div>
              <div class="form-field">
                <label class="form-label">Brand</label>
                <input class="input" [(ngModel)]="form.brand" name="brand" style="width:100%;" />
              </div>
              <div class="form-field">
                <label class="form-label">Weight</label>
                <input class="input" [(ngModel)]="form.weight" name="weight" placeholder="e.g., 500g" style="width:100%;" />
              </div>
              <div class="form-field">
                <label class="form-label">Description</label>
                <textarea class="input" rows="3" [(ngModel)]="form.description" name="description" style="width:100%;"></textarea>
              </div>
              <div class="form-field">
                <label class="form-label">Category <span style="color:var(--error);">*</span></label>
                <select class="input" [(ngModel)]="form.categoryId" name="categoryId" required style="width:100%;">
                  <option value="" disabled>Select a category</option>
                  <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div class="row" style="justify-content:flex-end; gap:var(--space-sm); margin-top:var(--space-sm);">
                <button class="btn btn-ghost" (click)="closeModal()">Cancel</button>
                <button class="btn btn-primary" (click)="submit()">{{ editing ? 'Update' : 'Create' }}</button>
              </div>
              <div *ngIf="crudError" class="alert-error" style="font-size:13px;">{{ crudError }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: CategoryDto[] = [];
  pagination = { page: 1, limit: 20, total: 0, pages: 1 };
  loading = true;
  loadingCategories = false;
  error: string | null = null;
  q = '';
  showModal = false;
  editing = false;
  form: Partial<Product> = { name: '', categoryId: '', description: '', brand: '', weight: '', image: '' } as any;
  crudError: string | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.reload();
    this.loadCategories();
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.categoryService.list().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loadingCategories = false;
      },
      error: () => {
        this.loadingCategories = false;
      }
    });
  }

  reload(): void {
    this.loading = true;
    this.error = null;
    this.productService.getProducts({ q: this.q, page: this.pagination.page, limit: this.pagination.limit }).subscribe({
      next: (res) => {
        this.products = res.products;
        this.pagination = res.pagination as any;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to load products';
        this.loading = false;
      }
    });
  }

  next(): void {
    if (this.pagination.page < this.pagination.pages) {
      this.pagination.page += 1;
      this.reload();
    }
  }

  prev(): void {
    if (this.pagination.page > 1) {
      this.pagination.page -= 1;
      this.reload();
    }
  }

  openAdd(): void {
    this.form = { name: '', categoryId: '', description: '', brand: '', weight: '', image: '' } as any;
    this.editing = false;
    this.crudError = null;
    this.showModal = true;
  }

  openEdit(p: Product): void {
    this.form = {
      id: p.id,
      name: p.name,
      categoryId: p.categoryId,
      description: p.description,
      brand: p.brand,
      weight: p.weight,
      image: p.image // Preserve existing image
    };
    this.editing = true;
    this.crudError = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  submit(): void {
    this.crudError = null;
    if (!this.form.name || !this.form.categoryId) {
      this.crudError = 'Name and category are required';
      return;
    }
    const payload: any = {
      name: this.form.name,
      categoryId: this.form.categoryId,
      description: this.form.description,
      brand: this.form.brand,
      weight: this.form.weight
    };

    // Only include image if it's been changed or set
    if (this.form.image) {
      payload.image = this.form.image;
    }

    if (this.editing && this.form.id) {
      this.productService.updateProduct(this.form.id, payload).subscribe({
        next: () => { this.showModal = false; this.reload(); },
        error: (err) => { this.crudError = err?.error?.message || 'Failed to update product'; }
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => { this.showModal = false; this.reload(); },
        error: (err) => { this.crudError = err?.error?.message || 'Failed to create product'; }
      });
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.form.image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
