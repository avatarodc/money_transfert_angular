import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.interface';
import { Demande } from '../models/demande.model';
import { HttpOptions } from '../models/http-options.interface';

@Injectable({
  providedIn: 'root'
})
export class DemandeService extends ApiService {

  private readonly BASE_PATH = '/demande';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // Méthode pour créer une nouvelle demande avec téléchargement de fichiers
  createDemande(formData: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}${this.BASE_PATH}`, formData, {
      headers: new HttpHeaders().delete('Content-Type')
    });
  }

  // Méthode pour lister les demandes
  listDemandes(options?: HttpOptions): Observable<ApiResponse<Demande[]>> {
    return this.get<Demande[]>(`${this.BASE_PATH}`, options);
  }

  // Méthode pour mettre à jour le statut d'une demande
  updateStatus(id: string, status: string, options?: HttpOptions): Observable<ApiResponse<Demande>> {
    return this.post<Demande>(`${this.BASE_PATH}/${id}/status`, { status }, options);
  }

  // Nouvelle méthode pour obtenir le nombre de demandes
  getDemandesCount(options?: HttpOptions): Observable<number> {
    return this.listDemandes(options).pipe(
      map(response => response.data.length)
    );
  }

}
