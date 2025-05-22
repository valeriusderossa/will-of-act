import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SentenceResponse, SentenceSummary } from '../models/sentence.model';
import { SentenceRequest } from '../models/sentence-request.model';

@Injectable({
  providedIn: 'root'
})
export class SentenceService {
  private readonly API_URL = 'http://localhost:8081/api/sentences';
  private readonly http = inject(HttpClient);

  getAllSentences(): Observable<SentenceResponse[]> {
    return this.http.get<SentenceResponse[]>(this.API_URL);
  }

  getAllSentenceSummaries(): Observable<SentenceSummary[]> {
    return this.http.get<SentenceSummary[]>(`${this.API_URL}/summaries`);
  }

  getSentenceById(id: number): Observable<SentenceResponse> {
    return this.http.get<SentenceResponse>(`${this.API_URL}/${id}`);
  }

  createSentence(request: SentenceRequest): Observable<SentenceResponse> {
    return this.http.post<SentenceResponse>(this.API_URL, request);
  }

  updateSentence(id: number, request: SentenceRequest): Observable<SentenceResponse> {
    return this.http.put<SentenceResponse>(`${this.API_URL}/${id}`, request);
  }

  deleteSentence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  searchSentences(searchText: string): Observable<SentenceResponse[]> {
    return this.http.get<SentenceResponse[]>(`${this.API_URL}/search`, {
      params: { searchText }
    });
  }
}
