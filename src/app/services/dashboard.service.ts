import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalProducts: number;
  salesTrend: { day: string, revenue: number }[];
}

export interface Advertisement {
  id: string;
  imageBase64: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  getStats(days?: number): Observable<DashboardStats> {
    const params = days ? `?days=${days}` : '';
    return this.http.get<DashboardStats>(`${this.baseUrl}/stats${params}`);
  }

  getAds(): Observable<{ advertisements: Advertisement[] }> {
    return this.http.get<{ advertisements: Advertisement[] }>(`${this.baseUrl}/advertisements`);
  }

  createAd(data: { imageBase64: string, description: string }): Observable<Advertisement> {
    return this.http.post<Advertisement>(`${this.baseUrl}/advertisements`, data);
  }

  toggleAd(id: string): Observable<Advertisement> {
    return this.http.patch<Advertisement>(`${this.baseUrl}/advertisements/${id}/toggle`, {});
  }

  deleteAd(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/advertisements/${id}`);
  }
}
