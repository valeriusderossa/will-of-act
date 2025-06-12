import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GymResponse, GymSummary } from '../models/gym.model';
import { GymRequest } from '../models/gym-request.model';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  private readonly apiUrl = 'http://localhost:8090/api/gym';

  constructor(private http: HttpClient) {}

  getAllGymExercises(): Observable<GymResponse[]> {
    return this.http.get<GymResponse[]>(this.apiUrl);
  }

  getAllGymSummaries(): Observable<GymSummary[]> {
    return this.http.get<GymSummary[]>(`${this.apiUrl}/summary`);
  }

  getGymExerciseById(id: string): Observable<GymResponse> {
    return this.http.get<GymResponse>(`${this.apiUrl}/${id}`);
  }

  getGymExercisesByDateRange(startDate: string, endDate: string): Observable<GymResponse[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<GymResponse[]>(`${this.apiUrl}/date-range`, { params });
  }

  getGymExercisesByBodyPart(partOfBody: string): Observable<GymResponse[]> {
    return this.http.get<GymResponse[]>(`${this.apiUrl}/body-part/${partOfBody}`);
  }

  searchGymExercisesByName(name: string): Observable<GymResponse[]> {
    const params = new HttpParams().set('name', name);
    return this.http.get<GymResponse[]>(`${this.apiUrl}/search`, { params });
  }

  getRecentGymExercises(days: number = 30): Observable<GymResponse[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<GymResponse[]>(`${this.apiUrl}/recent`, { params });
  }

  createGymExercise(gymRequest: GymRequest): Observable<GymResponse> {
    return this.http.post<GymResponse>(this.apiUrl, gymRequest);
  }

  updateGymExercise(id: string, gymRequest: GymRequest): Observable<GymResponse> {
    return this.http.put<GymResponse>(`${this.apiUrl}/${id}`, gymRequest);
  }

  deleteGymExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
