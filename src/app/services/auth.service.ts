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

interface UserData {
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

  testConnection(): Observable<ApiResponse<any>> {
    return this.get<any>('/test');
  }

  login(credentials: LoginCredentials): Observable<ApiResponse<any>> {
    // Log pour debug
    console.log('URL de base:', this.baseUrl);
    console.log('Credentials envoyés:', credentials);

    return this.post<any>('/auth/login', credentials)
      .pipe(
        tap({
          next: (response) => {
            console.log('Réponse du serveur:', response);
            if (response.data?.token) {
              localStorage.setItem('token', response.data.token);
            }
          },
          error: (error) => {
            console.error('Erreur de connexion:', error);
            throw error;
          }
        })
      );
  }

  register(userData: UserData): Observable<ApiResponse<any>> {
    return this.post<any>('/register', userData);
  }
}
