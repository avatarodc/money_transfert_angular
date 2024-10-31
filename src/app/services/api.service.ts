import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.interface';
import { HttpOptions } from '../models/http-options.interface';
import { UserRole } from '../models/user-role.enum';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected baseUrl = environment.apiUrl; // Utiliser l'URL complète du backend

  protected defaultOptions: HttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    withCredentials: true,
  };

  private jwtHelper = new JwtHelperService();
  private currentUserRole: UserRole = UserRole.USER;

  constructor(protected http: HttpClient) {
    this.initializeUserRole();
  }

  private initializeUserRole(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        this.currentUserRole = decodedToken.role;
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        this.currentUserRole = UserRole.USER;
      }
    }
  }

  public get<T>(
    endpoint: string,
    options?: HttpOptions
  ): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http
      .get<ApiResponse<T>>(fullUrl, { ...this.defaultOptions, ...options })
      .pipe(
        tap((response) => this.logResponse('GET', fullUrl, response)),
        catchError((error) => this.handleError(error))
      );
  }

  protected post<T>(
    endpoint: string,
    data: any,
    options?: HttpOptions
  ): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http
      .post<ApiResponse<T>>(fullUrl, data, {
        ...this.defaultOptions,
        ...options,
      })
      .pipe(
        tap((response) => this.logResponse('POST', fullUrl, response)),
        catchError((error) => this.handleError(error))
      );
  }

  protected put<T>(
    endpoint: string,
    data: any,
    options?: HttpOptions
  ): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http
      .put<ApiResponse<T>>(fullUrl, data, {
        ...this.defaultOptions,
        ...options,
      })
      .pipe(
        tap((response) => this.logResponse('PUT', fullUrl, response)),
        catchError((error) => this.handleError(error))
      );
  }

  protected delete<T>(
    endpoint: string,
    options?: HttpOptions
  ): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http
      .delete<ApiResponse<T>>(fullUrl, { ...this.defaultOptions, ...options })
      .pipe(
        tap((response) => this.logResponse('DELETE', fullUrl, response)),
        catchError((error) => this.handleError(error))
      );
  }

  private logResponse(method: string, url: string, response: any): void {
    if (!environment.production) {
      console.log(`[${method}] ${url}:`, response);
    }
  }

  private handleError(error: any): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Erreur client:', error.error.message);
    } else {
      // Erreur côté serveur
      console.error("Détails de l'erreur:", {
        status: error.status,
        body: error.error,
        url: error.url,
        headers: error.headers,
      });
    }
    return throwError(() => error);
  }

  public getCurrentUserRole(): UserRole {
    return this.currentUserRole;
  }

  public setCurrentUserRole(role: UserRole): void {
    this.currentUserRole = role;
  }

  public isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      // console.log('Token décodé:', decodedToken); // Pour déboguer
      return decodedToken.role === 'ADMIN';
    } catch (error) {
      console.error('Erreur de décodage du token:', error);
      return false;
    }
  }

  public isClient(): boolean {
    // console.log('currentUserRole', this.currentUserRole);
    return this.currentUserRole === UserRole.USER; // Déjà correct
  }
}
