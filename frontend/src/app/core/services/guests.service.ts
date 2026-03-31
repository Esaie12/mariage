import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guest } from '../models/api.models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class GuestsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/guests`;

  findAll(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.baseUrl);
  }

  create(payload: Omit<Guest, 'id' | 'uid' | 'status' | 'arrivalTime'>): Observable<Guest> {
    return this.http.post<Guest>(this.baseUrl, payload);
  }
}
