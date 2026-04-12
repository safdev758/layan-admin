import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private baseUrl = `${environment.apiUrl}/admin/settings`;

  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<{ deactivationPeriodDays: number }>(this.baseUrl);
  }

  set(deactivationPeriodDays: number) {
    return this.http.put<{ deactivationPeriodDays: number; message: string }>(this.baseUrl, { deactivationPeriodDays });
  }
}
