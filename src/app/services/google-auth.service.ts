import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService extends ApiService {
  private readonly BASE_PATH = '/google-auth';

  getAuthUrl(): Observable<ApiResponse<string>> {
    return this.get<string>(`${this.BASE_PATH}/url`);
  }

  importContacts(): Observable<ApiResponse<any>> {
    return this.post<any>(`${this.BASE_PATH}/import-contacts`, {});
  }
}
