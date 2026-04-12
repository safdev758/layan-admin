import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'SUPERMARKET' | 'DRIVER' | 'ADMIN';
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  createdAt?: string;
}

export interface Pagination { page: number; limit: number; total: number; pages: number }

export interface OrderDto {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  paymentMethod?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  items?: any[];
  driver?: any;
  user?: { id: string; name: string; email: string };
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  listUsers(role?: string, q?: string, page = 1, limit = 20) {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (role) params = params.set('role', role);
    if (q) params = params.set('q', q);
    return this.http.get<{ users: UserDto[]; pagination: Pagination }>(`${this.baseUrl}/users`, { params });
  }

  updateUserStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'PENDING', durationDays?: number) {
    const body: any = { status };
    if (status === 'SUSPENDED' && durationDays && durationDays > 0) body.durationDays = durationDays;
    return this.http.patch<{ message: string; user: UserDto }>(`${this.baseUrl}/users/${id}/status`, body);
  }

  listOrders(status?: string, page = 1, limit = 20) {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (status) params = params.set('status', status);
    return this.http.get<{ orders: OrderDto[]; pagination: Pagination }>(`${this.baseUrl}/orders`, { params });
  }
}
