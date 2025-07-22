import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = 'http://127.0.0.1:8000/testarticle';

  constructor(private http: HttpClient) {}

  verifierArticle(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
