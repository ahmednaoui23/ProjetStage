import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap, take } from 'rxjs';
import { User } from './user';
import { environment } from '../../enviroments/enviroment';
import { jwtDecode } from 'jwt-decode'; // don't forget to install this: npm i jwt-decode

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ✅ Utility method to get auth headers
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Signal privé pour suivre l’utilisateur connecté
  private _currentUser = signal<User | null>(null);
  currentUser = this._currentUser.asReadonly();

  // Statut de connexion
  isConnected = computed(() => this.currentUser() !== null);

  private http = inject(HttpClient);

  constructor() {
  this.loadUserFromToken();
}

  loadUserFromToken() {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        // Check token expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          console.log('Token expired');
          this.logout().pipe(take(1)).subscribe();
          return;
        }

        // Load user from localStorage if present
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          this._currentUser.set(JSON.parse(savedUser));
        } else {
          this._currentUser.set({ email: decoded.email } as User);
        }

      } catch (err) {
        console.log('Invalid token:', err);
        this.logout().pipe(take(1)).subscribe(); // clear bad token
      }
    }
  }

  // Vérifie si l’utilisateur est connecté
  isAuthenticated(): boolean {
    return this._currentUser() !== null && !!this.getToken();
  }

  // Connexion avec stockage du token et user info
  login(email: string, password: string): Observable<{
    token: string;
    user?: User;
  }> {
    return this.http.post<{
      token: string;
      user?: User;
    }>(`${environment.apiUrl}/login`, { email, password })
      .pipe(
        take(1),
        tap(response => {
          localStorage.setItem('token', response.token); // Stocker le token
          if (response.user) {
            this._currentUser.set(response.user); // Mettre à jour l’utilisateur
            localStorage.setItem('user', JSON.stringify(response.user)); // Persist user info
          }
        })
      );
  }

  // Rafraîchir les tokens
  refreshAccessToken(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/refresh-token`, {})
      .pipe(
        take(1),
        tap(response => {
          localStorage.setItem('token', response.token);
          this.loadUserFromToken();
          console.log('Token refreshed');
        })
      );
  }

  // Rafraîchir les tokens (revoke)
  revokeToken(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/revoke-token`, {})
      .pipe(
        take(1),
        tap(() => {
          console.log('Tokens revoked successfully');
        })
      );
  }

  // Déconnexion
  logout(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/logout`, {})
      .pipe(
        take(1),
        tap(() => {
          this._currentUser.set(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
      );
  }
}
