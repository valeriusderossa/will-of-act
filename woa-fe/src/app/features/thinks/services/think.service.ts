import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThinkResponse } from '../models/think.model';
import { ThinkRequest } from '../models/think-request.model';

@Injectable({
  providedIn: 'root'
})
export class ThinkService {
  private readonly apiUrl = 'http://localhost:8090/api/thinks';

  constructor(private http: HttpClient) {}

  getAllThinks(): Observable<ThinkResponse[]> {
    return this.http.get<ThinkResponse[]>(this.apiUrl);
  }

  getThinkById(id: number): Observable<ThinkResponse> {
    return this.http.get<ThinkResponse>(`${this.apiUrl}/${id}`);
  }

  createThink(think: ThinkRequest): Observable<ThinkResponse> {
    return this.http.post<ThinkResponse>(this.apiUrl, think);
  }

  updateThink(id: number, think: ThinkRequest): Observable<ThinkResponse> {
    return this.http.put<ThinkResponse>(`${this.apiUrl}/${id}`, think);
  }

  deleteThink(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
