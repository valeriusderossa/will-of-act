import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TechnicalLearningResponse, TechnicalLearningRequest, TechnicalLearningSummary } from '../index';

@Injectable({
  providedIn: 'root'
})
export class TechnicalLearningService {
  private readonly apiUrl = 'http://localhost:8090/api/learnings';

  constructor(private http: HttpClient) {}

  getAllTechnicalLearnings(): Observable<TechnicalLearningSummary[]> {
    return this.http.get<TechnicalLearningSummary[]>(this.apiUrl);
  }

  getTechnicalLearningById(id: number): Observable<TechnicalLearningResponse> {
    return this.http.get<TechnicalLearningResponse>(`${this.apiUrl}/${id}`);
  }

  createTechnicalLearning(learning: TechnicalLearningRequest): Observable<TechnicalLearningResponse> {
    return this.http.post<TechnicalLearningResponse>(this.apiUrl, learning);
  }

  updateTechnicalLearning(id: number, learning: TechnicalLearningRequest): Observable<TechnicalLearningResponse> {
    return this.http.put<TechnicalLearningResponse>(`${this.apiUrl}/${id}`, learning);
  }

  deleteTechnicalLearning(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTechnicalLearningsByLanguage(language: string): Observable<TechnicalLearningResponse[]> {
    return this.http.get<TechnicalLearningResponse[]>(`${this.apiUrl}/by-language/${language}`);
  }
}
