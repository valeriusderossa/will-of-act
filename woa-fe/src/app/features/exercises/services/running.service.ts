import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RunningResponse, RunningSummary } from '../models/running.model';
import { RunningRequest } from '../models/running-request.model';

@Injectable({
  providedIn: 'root'
})
export class RunningService {
  private readonly apiUrl = 'http://localhost:8090/api/running';

  constructor(private http: HttpClient) {}

  getAllRunningExercises(): Observable<RunningResponse[]> {
    return this.http.get<RunningResponse[]>(this.apiUrl);
  }

  getAllRunningSummaries(): Observable<RunningSummary[]> {
    return this.http.get<RunningSummary[]>(`${this.apiUrl}/summary`);
  }

  getRunningExerciseById(id: string): Observable<RunningResponse> {
    return this.http.get<RunningResponse>(`${this.apiUrl}/${id}`);
  }

  getRunningExercisesByDateRange(startDate: string, endDate: string): Observable<RunningResponse[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<RunningResponse[]>(`${this.apiUrl}/date-range`, { params });
  }

  getRunningExercisesByMinDistance(minDistance: number): Observable<RunningResponse[]> {
    const params = new HttpParams().set('minDistance', minDistance.toString());
    return this.http.get<RunningResponse[]>(`${this.apiUrl}/min-distance`, { params });
  }

  getRecentRunningExercises(days: number = 30): Observable<RunningResponse[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<RunningResponse[]>(`${this.apiUrl}/recent`, { params });
  }

  getAverageDistanceSince(startDate: string): Observable<{averageDistance: number}> {
    const params = new HttpParams().set('startDate', startDate);
    return this.http.get<{averageDistance: number}>(`${this.apiUrl}/average-distance`, { params });
  }

  createRunningExercise(runningRequest: RunningRequest): Observable<RunningResponse> {
    return this.http.post<RunningResponse>(this.apiUrl, runningRequest);
  }

  updateRunningExercise(id: string, runningRequest: RunningRequest): Observable<RunningResponse> {
    return this.http.put<RunningResponse>(`${this.apiUrl}/${id}`, runningRequest);
  }

  deleteRunningExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
