import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.interface';
import { Contact } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends ApiService {
  private readonly BASE_PATH = '/contacts';

  // Créer un nouveau contact
  createContactByPhone(phoneNumber: string, nickname?: string): Observable<ApiResponse<Contact>> {
    return this.post<Contact>(this.BASE_PATH, { phoneNumber, nickname });
  }

  // Récupérer tous les contacts de l'utilisateur
  getContacts(): Observable<ApiResponse<Contact[]>> {
    return this.get<Contact[]>(this.BASE_PATH);
  }

  // Mettre à jour un contact
  updateContact(id: string, nickname: string): Observable<ApiResponse<Contact>> {
    return this.put<Contact>(`${this.BASE_PATH}/${id}`, { nickname });
  }

  // Supprimer un contact
  deleteContact(id: string): Observable<ApiResponse<void>> {
    return this.delete<void>(`${this.BASE_PATH}/${id}`);
  }

  // Récupérer les contacts Google importés
  getGoogleContacts(): Observable<ApiResponse<{
    hasGoogleAuth: boolean;
    contacts: Contact[];
  }>> {
    return this.get<{
      hasGoogleAuth: boolean;
      contacts: Contact[];
    }>(`${this.BASE_PATH}/google`);
  }
}
