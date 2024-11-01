import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactGoogleService extends ApiService {
  private readonly GOOGLE_PATH = '/google';

  getGoogleAuthUrl(): Observable<ApiResponse<{ url: string }>> {
    return this.get<{ url: string }>(this.GOOGLE_PATH + '/url');
  }

  importGoogleContacts(): Observable<ApiResponse<{
    totalContacts: number;
    contactsWithEmail: number;
    matchedUsers: number;
    importedContacts: number;
    existingContacts: number;
  }>> {
    return this.post(this.GOOGLE_PATH + '/import-contacts', {});
  }
}
