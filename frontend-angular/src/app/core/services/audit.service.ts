import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditLogResponse } from '../models/audit.model';

const API_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class AuditService {
  constructor(private http: HttpClient) {}

  getLogs(filters: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    entityType?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Observable<AuditLogResponse> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, v);
    });
    return this.http.get<AuditLogResponse>(`${API_URL}/audit/logs`, { params });
  }
}
