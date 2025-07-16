import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

// Define the Article interface if needed
export interface Article {
  id: number;
  code: string;
  name: string;
  color: string;
  sousFamille: string;
  saison: string;
  saisiPar: string; // Added property
  // Add other properties if needed
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiUrl}/articles`);
  }
  private http = inject(HttpClient);

  // Existing method
  getProtectedData(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${environment.apiUrl}/dashboard`);
  }

  // ✅ Get all articles (for dashboard table)
  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiUrl}/articles`);
  }

  // ✅ Verify anomalies for selected article IDs
  verifyAnomalies(ids: number[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/articles/verify`, { ids });
  }
}
