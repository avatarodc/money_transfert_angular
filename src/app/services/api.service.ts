import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.interface';
import { HttpOptions } from '../models/http-options.interface';
import { UserRole } from '../models/user-role.enum';
import { JwtHelperService } from '@auth0/angular-jwt';

// Interface pour le token décodé
interface DecodedToken {
  userId: string;
  role: UserRole;
  exp: number;
  iat: number;
  email?: string;
}

// Interface pour les informations du token
interface TokenInfo {
  userId: string;
  role: UserRole;
  isValid: boolean;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected baseUrl = environment.apiUrl;
  private jwtHelper = new JwtHelperService();
  private currentUserRole: UserRole = UserRole.USER;

  // BehaviorSubject pour suivre l'état de l'authentification
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(protected http: HttpClient) {
    this.initializeAuth();
  }

  // Initialisation de l'authentification
  private initializeAuth(): void {
    const tokenInfo = this.getTokenInfo();
    if (tokenInfo) {
      this.currentUserRole = tokenInfo.role;
      this.isAuthenticatedSubject.next(true);
    } else {
      this.currentUserRole = UserRole.USER;
      this.isAuthenticatedSubject.next(false);
    }
  }

  // Gestion des headers HTTP
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');

    const token = localStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Options HTTP par défaut
  protected get defaultOptions(): HttpOptions {
    return {
      headers: this.getAuthHeaders(),
      withCredentials: true,
    };
  }

  // Méthodes HTTP de base
  public get<T>(endpoint: string, options?: HttpOptions): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    const mergedOptions = this.mergeOptions(options);

    return this.http.get<ApiResponse<T>>(fullUrl, mergedOptions).pipe(
      tap(response => this.logResponse('GET', fullUrl, response)),
      catchError(error => this.handleError(error))
    );
  }

  public post<T>(endpoint: string, data: any, options?: HttpOptions): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    const mergedOptions = this.mergeOptions(options);

    return this.http.post<ApiResponse<T>>(fullUrl, data, mergedOptions).pipe(
      tap(response => this.logResponse('POST', fullUrl, response)),
      catchError(error => this.handleError(error))
    );
  }


  protected patch<T>(endpoint: string, data: any, options?: HttpOptions): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    let mergedOptions = this.mergeOptions(options);

    if (data instanceof FormData) {
        const headers = mergedOptions.headers ? mergedOptions.headers.delete('Content-Type') : new HttpHeaders();
        mergedOptions = {
            ...mergedOptions,
            headers
        };
    }

    return this.http.patch<ApiResponse<T>>(fullUrl, data, mergedOptions).pipe(
        tap(response => this.logResponse('PATCH', fullUrl, response)),
        catchError(error => this.handleError(error))
    );
}

protected mergeOptions(options?: HttpOptions): HttpOptions {
    const defaultOptions = this.defaultOptions;
    if (!options) {
        return defaultOptions;
    }

    let mergedHeaders = this.getAuthHeaders();

    if (options.headers) {
        options.headers.keys().forEach(key => {
            const value = options.headers?.get(key);
            if (value) {
                mergedHeaders = mergedHeaders.set(key, value);
            }
        });
    }

    return {
        ...defaultOptions,
        ...options,
        headers: mergedHeaders,
    };
}

  public put<T>(endpoint: string, data: any, options?: HttpOptions): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    const mergedOptions = this.mergeOptions(options);

    return this.http.put<ApiResponse<T>>(fullUrl, data, mergedOptions).pipe(
      tap(response => this.logResponse('PUT', fullUrl, response)),
      catchError(error => this.handleError(error))
    );
  }

  public delete<T>(endpoint: string, options?: HttpOptions): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    const mergedOptions = this.mergeOptions(options);

    return this.http.delete<ApiResponse<T>>(fullUrl, mergedOptions).pipe(
      tap(response => this.logResponse('DELETE', fullUrl, response)),
      catchError(error => this.handleError(error))
    );
  }

  // Gestion du token et authentification
  public getTokenInfo(): TokenInfo | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.handleTokenExpiration();
        return null;
      }

      const decodedToken = this.jwtHelper.decodeToken(token) as DecodedToken;

      return {
        userId: decodedToken.userId,
        role: decodedToken.role,
        isValid: true,
        email: decodedToken.email
      };
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  public checkAuthentication(): boolean {
    const tokenInfo = this.getTokenInfo();
    const isAuth = !!tokenInfo && tokenInfo.isValid;
    this.isAuthenticatedSubject.next(isAuth);
    return isAuth;
  }

  public getCurrentUserId(): string | null {
    const tokenInfo = this.getTokenInfo();
    return tokenInfo ? tokenInfo.userId : null;
  }

  public getCurrentUserRole(): UserRole {
    const tokenInfo = this.getTokenInfo();
    return tokenInfo ? tokenInfo.role : UserRole.USER;
  }

  public getCurrentUserEmail(): string | null {
    const tokenInfo = this.getTokenInfo();
    return tokenInfo?.email || null;
  }

  // Méthodes de vérification des rôles
  public isAdmin(): boolean {
    const tokenInfo = this.getTokenInfo();
    return tokenInfo ? tokenInfo.role === UserRole.ADMIN : false;
  }

  public isClient(): boolean {
    const tokenInfo = this.getTokenInfo();
    return tokenInfo ? tokenInfo.role === UserRole.USER : false;
  }

  public isAgent(): boolean {
    const tokenInfo = this.getTokenInfo();
    return tokenInfo ? tokenInfo.role === UserRole.AGENT : false;
  }

  // Gestion de la déconnexion
  public logout(): void {
    localStorage.removeItem('token');
    this.currentUserRole = UserRole.USER;
    this.isAuthenticatedSubject.next(false);
  }

  // Utilitaires privés
  // private mergeOptions(options?: HttpOptions): HttpOptions {
  //   if (!options) {
  //     return this.defaultOptions;
  //   }

  //   let mergedHeaders = this.getAuthHeaders();

  //   if (options.headers) {
  //     options.headers.keys().forEach(key => {
  //       const value = options.headers?.get(key);
  //       if (value) {
  //         mergedHeaders = mergedHeaders.set(key, value);
  //       }
  //     });
  //   }

  //   return {
  //     ...this.defaultOptions,
  //     ...options,
  //     headers: mergedHeaders,
  //   };
  // }

  private logResponse(method: string, url: string, response: any): void {
    if (!environment.production) {
      console.log(`[${method}] ${url}:`, response);
    }
  }

  private handleError(error: any): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        this.handleUnauthorized();
      }

      console.error("Erreur HTTP:", {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: error.error?.message || 'Une erreur est survenue'
      });
    } else {
      console.error("Erreur:", error);
    }

    return throwError(() => error);
  }

  private handleUnauthorized(): void {
    this.logout();
    // Vous pouvez ajouter ici la logique de redirection vers la page de connexion
  }

  private handleTokenExpiration(): void {
    this.logout();
    // Vous pouvez ajouter ici la logique pour gérer l'expiration du token
    // (par exemple, rafraîchissement du token ou redirection)
  }

  // Méthode pour vérifier les permissions

}
