import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LearningResponse, LearningRequest } from '../index';

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private readonly apiUrl = 'http://localhost:8080/api/learnings';

  constructor(private http: HttpClient) {}

  getAllLearnings(): Observable<LearningResponse[]> {
    return this.http.get<LearningResponse[]>(this.apiUrl);
  }

  getLearningById(id: number): Observable<LearningResponse> {
    return this.http.get<LearningResponse>(`${this.apiUrl}/${id}`);
  }

  createLearning(learning: LearningRequest): Observable<LearningResponse> {
    return this.http.post<LearningResponse>(this.apiUrl, learning);
  }

  updateLearning(id: number, learning: LearningRequest): Observable<LearningResponse> {
    return this.http.put<LearningResponse>(`${this.apiUrl}/${id}`, learning);
  }

  deleteLearning(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getLearningsByLanguage(language: string): Observable<LearningResponse[]> {
    return this.http.get<LearningResponse[]>(`${this.apiUrl}/by-language/${language}`);
  }

  searchLearnings(query: string): Observable<LearningResponse[]> {
    return this.http.get<LearningResponse[]>(`${this.apiUrl}/search?q=${query}`);
  }
}
