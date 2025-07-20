import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Article {
  Article: string;
  Code: string;
  Couleur: string;
  Famille: string;
  Grille: string;
  IDArticle: number;
  SaisiPar: string;
  Saison: string;
  SousFamille: string;
}

export interface ArticlesResponse {
  articles: Article[];
  limit: number;
  next_page: string | null;
  page: number;
  prev_page: string | null;
  total_articles: number;
  total_pages: number;
}

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = 'http://127.0.0.1:5000/articles';

  constructor(private http: HttpClient) {}

  getArticles(page: number = 1): Observable<ArticlesResponse> {
    return this.http.get<ArticlesResponse>(`${this.apiUrl}?page=${page}`);
  }

  searchArticles(code: string, page: number = 1): Observable<ArticlesResponse> {
    return this.http.get<ArticlesResponse>(
      `${this.apiUrl}/search?code=${encodeURIComponent(code)}&page=${page}`
    );
  }
}
