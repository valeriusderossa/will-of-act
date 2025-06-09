import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuotationResponse, QuotationSummary, QuotationRequest } from '../index';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {
  private readonly API_URL = 'http://localhost:8090/api/quotations';
  private readonly http = inject(HttpClient);

  getAllQuotations(sortBy: string = 'createdAt'): Observable<QuotationResponse[]> {
    const params = new HttpParams().set('sortBy', sortBy);
    return this.http.get<QuotationResponse[]>(this.API_URL, { params });
  }

  getAllQuotationSummaries(sortBy: string = 'createdAt'): Observable<QuotationSummary[]> {
    const params = new HttpParams().set('sortBy', sortBy);
    return this.http.get<QuotationSummary[]>(`${this.API_URL}/summary`, { params });
  }

  getQuotationById(id: number): Observable<QuotationResponse> {
    return this.http.get<QuotationResponse>(`${this.API_URL}/${id}`);
  }

  createQuotation(request: QuotationRequest): Observable<QuotationResponse> {
    return this.http.post<QuotationResponse>(this.API_URL, request);
  }

  updateQuotation(id: number, request: QuotationRequest): Observable<QuotationResponse> {
    return this.http.put<QuotationResponse>(`${this.API_URL}/${id}`, request);
  }

  deleteQuotation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
