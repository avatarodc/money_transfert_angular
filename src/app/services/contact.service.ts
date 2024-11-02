import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.interface';
import { Contact } from '../models/contact.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends ApiService {
  private readonly BASE_PATH = '/contacts';

  getContacts(): Observable<ApiResponse<Contact[]>> {
    return this.get<Contact[]>(this.BASE_PATH);
  }

  addContact(contact: Partial<Contact>): Observable<ApiResponse<Contact>> {
    return this.post<Contact>(this.BASE_PATH, contact);
  }

  updateContact(id: string, contact: Partial<Contact>): Observable<ApiResponse<Contact>> {
    return this.put<Contact>(`${this.BASE_PATH}/${id}`, contact);
  }

  deleteContact(id: string): Observable<ApiResponse<void>> {
    return this.delete<void>(`${this.BASE_PATH}/${id}`);
  }

  getGoogleContacts(): Observable<ApiResponse<Contact[]>> {
    return this.get<Contact[]>(`${this.BASE_PATH}/google`);
  }
}
