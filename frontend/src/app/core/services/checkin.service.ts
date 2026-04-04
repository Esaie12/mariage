import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckInPayload, Guest } from '../models/api.models';
import { API_BASE_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class CheckinService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/check-in`;

  checkIn(payload: CheckInPayload): Observable<Guest> {
    return this.http.post<Guest>(this.baseUrl, payload);
  }
}
