import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.interface';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends ApiService {
  private readonly BASE_PATH = '/transactions';

  // Récupérer toutes les transactions (admin uniquement)
  getAllTransactions(): Observable<ApiResponse<Transaction[]>> {
    return this.get<Transaction[]>(`${this.BASE_PATH}/all`);
  }

  // Récupérer les transactions d'un utilisateur spécifique
  getAllTransactionsByUser(userId: string): Observable<ApiResponse<Transaction[]>> {
    return this.get<Transaction[]>(`${this.BASE_PATH}/user/${userId}/all`);
  }

  // Récupérer les transactions d'un wallet spécifique
  getAllTransactionsByWallet(walletId: string): Observable<ApiResponse<Transaction[]>> {
    return this.get<Transaction[]>(`${this.BASE_PATH}/wallet/${walletId}/all`);
  }

  // Créer un dépôt (agents uniquement)
  createDeposit(data: {
    userId: string;
    amount: number;
    description?: string;
  }): Observable<ApiResponse<Transaction>> {
    return this.post<Transaction>(`${this.BASE_PATH}/deposit`, data);
  }

  // Créer un retrait (agents uniquement)
  createWithdrawal(data: {
    userId: string;
    amount: number;
    description?: string;
  }): Observable<ApiResponse<Transaction>> {
    return this.post<Transaction>(`${this.BASE_PATH}/withdrawal`, data);
  }

  // Créer un transfert (clients, agents, et admins)
  createTransfer(data: {
    receiverId: string;
    amount: number;
    description?: string;
  }): Observable<ApiResponse<Transaction>> {
    return this.post<Transaction>(`${this.BASE_PATH}/transfer`, data);
  }

  // Ajouter du solde à un agent (admin uniquement)
  addBalanceToUserAgent(data: {
    userId: string;
    amount: number;
    description?: string;
  }): Observable<ApiResponse<Transaction>> {
    return this.post<Transaction>(`${this.BASE_PATH}/add-balance`, data);
  }
}
