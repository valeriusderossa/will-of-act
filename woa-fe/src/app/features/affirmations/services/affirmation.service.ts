import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AffirmationResponse, AffirmationSummary, AffirmationRequest } from '../index';

@Injectable({
  providedIn: 'root'
})
export class AffirmationService {
  private readonly API_URL = 'http://localhost:8090/api/affirmations';
  private readonly http = inject(HttpClient);

  getAllAffirmations(): Observable<AffirmationResponse[]> {
    return this.http.get<AffirmationResponse[]>(this.API_URL);
  }

  getAllAffirmationSummaries(): Observable<AffirmationSummary[]> {
    return this.http.get<AffirmationSummary[]>(`${this.API_URL}/summaries`);
  }

  getAffirmationById(id: number): Observable<AffirmationResponse> {
    return this.http.get<AffirmationResponse>(`${this.API_URL}/${id}`);
  }

  createAffirmation(request: AffirmationRequest): Observable<AffirmationResponse> {
    return this.http.post<AffirmationResponse>(this.API_URL, request);
  }

  updateAffirmation(id: number, request: AffirmationRequest): Observable<AffirmationResponse> {
    return this.http.put<AffirmationResponse>(`${this.API_URL}/${id}`, request);
  }

  deleteAffirmation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
