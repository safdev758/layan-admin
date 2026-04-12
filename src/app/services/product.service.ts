import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id?: string;
  name: string;
  description?: string;
  categoryId: string;
  category?: { id: string; name: string };
  brand?: string;
  weight?: string;
  image?: string;  // Changed from imageUrl to image
  nutritionalInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductsResponse {
  products: Product[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/admin/global-products`;

  constructor(private http: HttpClient) {}

  // Get all products (with optional filters/pagination)
  getProducts(params?: {
    q?: string;
    categoryId?: string;
    onSale?: boolean;
    sort?: 'name' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Observable<ProductsResponse> {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    if (params?.onSale !== undefined) query.set('onSale', String(params.onSale));
    if (params?.sort) query.set('sort', params.sort);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
    const url = query.toString() ? `${this.apiUrl}?${query.toString()}` : this.apiUrl;
    return this.http.get<ProductsResponse>(url);
  }

  // Get single product by ID
  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Create new product
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  // Update product
  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  // Delete product
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get products by category
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?categoryId=${categoryId}`);
  }

  // Upload product image
  uploadImage(productId: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post(`${this.apiUrl}/${productId}/image`, formData);
  }
}
