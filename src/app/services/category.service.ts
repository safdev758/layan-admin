import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<CategoryDto[]>(`${this.baseUrl}`);
  }

  create(data: { name: string; description?: string; image?: string }) {
    return this.http.post<CategoryDto>(`${this.baseUrl}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
