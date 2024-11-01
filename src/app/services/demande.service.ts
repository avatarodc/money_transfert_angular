import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.interface';
import { Demande } from '../models/demande.model';
import { HttpOptions } from '../models/http-options.interface';

@Injectable({
  providedIn: 'root'
})
export class DemandeService extends ApiService {

  private readonly demandeEndpoint = '/demande';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // Méthode pour créer une nouvelle demande avec téléchargement de fichiers
  createDemande(data: FormData, options?: HttpOptions): Observable<ApiResponse<Demande>> {
    return this.post<Demande>(`${this.demandeEndpoint}`, data, {
      ...options,
      headers: options?.headers || new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }

  // Méthode pour lister les demandes
  listDemandes(options?: HttpOptions): Observable<ApiResponse<Demande[]>> {
    return this.get<Demande[]>(`${this.demandeEndpoint}`, options);
  }

  // Méthode pour mettre à jour le statut d'une demande
  updateStatus(id: string, status: string, options?: HttpOptions): Observable<ApiResponse<Demande>> {
    return this.post<Demande>(`${this.demandeEndpoint}/${id}/status`, { status }, options);
  }

}
