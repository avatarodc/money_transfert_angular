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
export class ProcessService extends ApiService {

  private readonly jobEndpoint = '/job';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  //Methode pour le processus de la demande
  processDemande(options?: HttpOptions): Observable<ApiResponse<any>> {
    return this.get<any>(`${this.jobEndpoint}/process-accounts`, options);
  }

}
