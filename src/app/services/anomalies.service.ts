import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnomalieService {
  private baseUrl = 'http://localhost:5000/anomalies'; // ou ton vrai backend

  constructor(private http: HttpClient) {}

  getAnomalies(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?page=${page}`);
  }
}
