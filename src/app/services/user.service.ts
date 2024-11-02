import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.interface';
import {
  User,
  Client,
  Agent,
  CreateAgentRequest,
  CreateClientRequest,
  UserRole
} from '../models/user.model';
import { HttpParams } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import {Transaction} from '../models/transaction.model';
import {Contact} from '../models/contact.model';
import {HttpOptions} from '../models/http-options.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {
  private readonly BASE_PATH = `/users`;

  // Récupérer l'utilisateur connecté
  getCurrentUser(): Observable<ApiResponse<User>> {


    try {

      // Utiliser l'ID spécifique de l'utilisateur
      return this.get<User>(`${this.BASE_PATH}/me/moi`).pipe(
        tap(response => console.log('API Response:', response)),
        catchError(error => {
          console.error('API Error:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Error decoding token:', error);
      return throwError(() => new Error('Invalid token format'));
    }
  }

  // Créer un agent ou admin
  createAgent(agentData: CreateAgentRequest): Observable<ApiResponse<Agent>> {
    return this.post<Agent>(`${this.BASE_PATH}/create-agent`, agentData);
  }

  // Créer un client (avec upload de fichiers)
  createClient(clientData: CreateClientRequest): Observable<ApiResponse<Client>> {
    const formData = new FormData();

    // Ajouter les champs de base
    Object.keys(clientData).forEach(key => {
      if (key !== 'idCardFrontPhoto' && key !== 'idCardBackPhoto') {
        const value = clientData[key as keyof CreateClientRequest];
        if (value !== undefined) {
          formData.append(key, value as string);
        }
      }
    });

    // Ajouter les fichiers
    formData.append('idCardFrontPhoto', clientData.idCardFrontPhoto);
    formData.append('idCardBackPhoto', clientData.idCardBackPhoto);

    const options = {
      headers: undefined
    };

    return this.post<Client>(`${this.BASE_PATH}/create-client`, formData, options);
  }

  // Récupérer un utilisateur par ID
  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.get<User>(`${this.BASE_PATH}/${id}`);
  }

  // Lister les utilisateurs avec filtre optionnel par rôle
  listUsers(role?: UserRole): Observable<ApiResponse<User[]>> {
    const options = role ? { params: new HttpParams().set('role', role) } : undefined;
    return this.get<User[]>(this.BASE_PATH, options);
  }

  // Supprimer un utilisateur
  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.delete<void>(`${this.BASE_PATH}/${id}`);
  }

  // Traiter une demande de récupération des données utilisateur
  getDmandeParseData(id: string): Observable<ApiResponse<any>> {
    return this.get<any>(`${this.BASE_PATH}/dmande/${id}`);
  }

  // Mettre à jour les informations de l'utilisateur
  updateUser(id: string, userData: Partial<User>): Observable<ApiResponse<User>> {
    return this.put<User>(`${this.BASE_PATH}/${id}`, userData);
  }

  // Récupérer les agents
  getAgents(): Observable<ApiResponse<Agent[]>> {
    return this.get<Agent[]>(`${this.BASE_PATH}`, {
      params: new HttpParams().set('role', UserRole.AGENT)
    });
  }

  // Récupérer les clients
  getClients(): Observable<ApiResponse<Client[]>> {
    return this.get<Client[]>(`${this.BASE_PATH}`, {
      params: new HttpParams().set('role', UserRole.CLIENT)
    });
  }

  logout() {
    localStorage.removeItem('token');
    // Si vous utilisez un BehaviorSubject pour l'état de connexion
    // this.currentUserSubject.next(null);
  }

  // Mettre à jour le profil utilisateur avec FormData
  updateProfile(userId: string, formData: FormData, options?: HttpOptions): Observable<ApiResponse<User>> {
    return this.patch<User>(`${this.BASE_PATH}/${userId}`, formData,{
      ...options,
      headers: options?.headers || new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }


}
