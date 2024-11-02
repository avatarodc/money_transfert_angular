import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  constructor(private http: HttpClient) {}

  fetchData() {
    console.log("fetchData called"); // Vérification si la fonction est bien appelée
    return this.http.get('/api/users/');
  }
}
