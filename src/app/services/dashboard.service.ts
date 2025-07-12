import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);

  getProtectedData(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${environment.apiUrl}/dashboard`);
  }
}
