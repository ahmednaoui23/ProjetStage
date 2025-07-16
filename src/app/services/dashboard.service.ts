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
  grille?: string; // Optional property for grid
  saisiPar: string; // Added property
  // Add other properties if needed
}
export interface ArticleResponse {
  page: number;
  limit: number;
  total_pages: number;
  total_articles: number;
  next_page: string | null;
  prev_page: string | null;
  articles: Article[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiUrl}/articles`);
  }
  private http = inject(HttpClient);

  // Existing method
  getProtectedData(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${environment.apiUrl}/dashboard`);
  }

  // ✅ Verify anomalies for selected article IDs
  verifyAnomalies(ids: number[]): Observable<any> {
    return this.http.post(`${environment.apiUrl}/articles/verify`, { ids });
  }
}
