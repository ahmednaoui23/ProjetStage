import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap, take } from 'rxjs';
import { User } from './user';
import { environment } from '../../enviroments/enviroment';
import { jwtDecode } from 'jwt-decode'; // npm i jwt-decode

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // 🟩 Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // 🟩 Auth headers
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // 🟩 Signal for user state
  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();
  isConnected = computed(() => this.currentUser() !== null);

  constructor() {
    this.loadUserFromToken();
  }

  // 🟩 Register (used by the popup)
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      username,
      email,
      password
    });
  }

  // 🟩 Load user from JWT token
  loadUserFromToken() {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp && decoded.exp < currentTime) {
          console.log('Token expired');
          this.logout().pipe(take(1)).subscribe();
          return;
        }

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          this._currentUser.set(JSON.parse(savedUser));
        } else {
          this._currentUser.set({ email: decoded.email } as User);
        }

      } catch (err) {
        console.log('Invalid token:', err);
        this.logout().pipe(take(1)).subscribe();
      }
    }
  }

  // 🟩 Auth check
  isAuthenticated(): boolean {
    return this._currentUser() !== null && !!this.getToken();
  }

  // 🟩 Login
  login(email: string, password: string): Observable<{ token: string; user?: User }> {
    return this.http.post<{ token: string; user?: User }>(
      `${this.apiUrl}/login`, { email, password }
    ).pipe(
      take(1),
      tap(response => {
        localStorage.setItem('token', response.token);
        if (response.user) {
          this._currentUser.set(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }

  // 🟩 Refresh access token
  refreshAccessToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}).pipe(
      take(1),
      tap(response => {
        localStorage.setItem('token', response.token);
        this.loadUserFromToken();
        console.log('Token refreshed');
      })
    );
  }

  // 🟩 Revoke token
  revokeToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/revoke-token`, {}).pipe(
      take(1),
      tap(() => {
        console.log('Tokens revoked successfully');
      })
    );
  }

  // 🟩 Logout
  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}).pipe(
      take(1),
      tap(() => {
        this._currentUser.set(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
    );
  }
}
