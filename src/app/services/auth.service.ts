import { Injectable } from '@angular/core';
import { Observable, pipe, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface LoginCredentials {
  phone: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  constructor(private router: Router, protected override http: HttpClient) {
    super(http);
  }

  // Tester la connexion
  testConnection(): Observable<ApiResponse<any>> {
    return this.get<any>('/test');
  }

  // Connexion
  login(credentials: LoginCredentials): Observable<ApiResponse<any>> {
    return this.post<any>('/auth/login', credentials)
      .pipe(
        tap({
          next: (response) => {
            if (response && !response.error && response.data) {
              const { accessToken, refreshToken } = response.data;
              if (accessToken && refreshToken) {
                this.setTokens(accessToken, refreshToken);
              }
            } else {
              console.error('Erreur lors de la connexion:', response.message || 'Aucune réponse');
            }
          }
        })
      );
  }

  // Actualiser le token
  refreshToken(): Observable<ApiResponse<any>> {
    const refreshToken = localStorage.getItem('refreshToken');

    return this.post<any>('/auth/refresh-token', { refreshToken })
      .pipe(
        tap({
          next: (response) => {
            if (response.data?.accessToken) {
              console.log(response.data?.accessToken)

              this.setAccessToken(response.data.accessToken);
            }
          },
          error: (error) => {
            this.logout();
            throw error;
          }
        })
      );
  }

  // Se déconnecter
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }

  // Définir les tokens
  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private setAccessToken(token: string): void {
    console.log(token)
    localStorage.setItem('accessToken', token);
  }
}
