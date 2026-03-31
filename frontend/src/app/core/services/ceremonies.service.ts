import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ceremony } from '../models/api.models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class CeremoniesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/ceremonies`;

  findAll(): Observable<Ceremony[]> {
    return this.http.get<Ceremony[]>(this.baseUrl);
  }

  create(payload: Omit<Ceremony, 'id'>): Observable<Ceremony> {
    return this.http.post<Ceremony>(this.baseUrl, payload);
  }

  update(id: number, payload: Omit<Ceremony, 'id'>): Observable<Ceremony> {
    return this.http.patch<Ceremony>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
