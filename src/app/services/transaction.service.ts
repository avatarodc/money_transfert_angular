import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.interface';
import { Transaction } from '../models/transaction.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends ApiService {
  private readonly BASE_PATH = '/transaction';

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
    senderWalletId: string;
    amount: number;
    description: string;
    currency: string;
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

  // Créer un transfert standard (clients, agents)
  createTransfer(data: {
    senderWalletId: string;
    receiverWalletId: string;
    amount: number;
    currency: string;
  }): Observable<ApiResponse<Transaction>> {
    return this.post<Transaction>(`${this.BASE_PATH}/transfer`, data);
  }

  // Créer un transfert administratif (admin uniquement)
  createAdminTransfer(data: {
    senderWalletId: string;
    receiverWalletId: string;
    amount: number;
    currency: string;
  }): Observable<ApiResponse<Transaction>> {
    return this.post<Transaction>(`${this.BASE_PATH}/admin-transfer`, data);
  }

  // Ajouter du solde à un agent (admin uniquement)
addBalanceToUserAgent(data: {
  userAgentWalletId: string;  // Changé pour correspondre au backend
  amount: number;
  description?: string;
}): Observable<ApiResponse<Transaction>> {
  return this.post<Transaction>(`${this.BASE_PATH}/add-balance`, data);
}

  // Récupérer les statistiques des transactions (admin uniquement)
  getTransactionStats(): Observable<ApiResponse<{
    totalTransactions: number;
    totalAmount: number;
    depositAmount: number;
    withdrawalAmount: number;
    transferAmount: number;
    totalFees: number;
  }>> {
    return this.get(`${this.BASE_PATH}/stats`);
  }

  // Récupérer l'historique des frais (admin uniquement)
  getFeesHistory(): Observable<ApiResponse<{
    amount: number;
    createdAt: Date;
    transactionType: string;
  }[]>> {
    return this.get(`${this.BASE_PATH}/fees-history`);
  }

  // Récupérer les transactions par type
  getTransactionsByType(type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFERE'): Observable<ApiResponse<Transaction[]>> {
    return this.get<Transaction[]>(`${this.BASE_PATH}/type/${type}`);
  }

  // Récupérer les transactions par période
  getTransactionsByPeriod(startDate: Date, endDate: Date): Observable<ApiResponse<Transaction[]>> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());
    return this.get<Transaction[]>(`${this.BASE_PATH}/period`, { params });
  }

  // Annuler une transaction (admin uniquement)
  cancelTransaction(transactionId: string): Observable<ApiResponse<Transaction>> {
    return this.post<Transaction>(`${this.BASE_PATH}/${transactionId}/cancel`, {});
  }

  // Vérifier le statut d'une transaction
  checkTransactionStatus(reference: string): Observable<ApiResponse<{
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    transaction: Transaction;
  }>> {
    return this.get(`${this.BASE_PATH}/status/${reference}`);
  }

  // Récupérer les transactions en attente (admin uniquement)
  getPendingTransactions(): Observable<ApiResponse<Transaction[]>> {
    return this.get<Transaction[]>(`${this.BASE_PATH}/pending`);
  }

  // Valider une transaction en attente (admin uniquement)
  approveTransaction(transactionId: string): Observable<ApiResponse<Transaction>> {
    return this.post<Transaction>(`${this.BASE_PATH}/${transactionId}/approve`, {});
  }

  // Rejeter une transaction en attente (admin uniquement)
  rejectTransaction(transactionId: string, reason: string): Observable<ApiResponse<Transaction>> {
    return this.post<Transaction>(`${this.BASE_PATH}/${transactionId}/reject`, { reason });
  }

  // Récupérer le résumé des transactions par jour (admin uniquement)
  // getDailyTransactionsSummary(): Observable<ApiResponse<{
  //   date: string;
  //   totalTransactions: number;
  //   totalAmount: number;
  //   totalFees: number;
  // }[]>> {
  //   return this.get(`${this.BASE_PATH}/daily-summary`);
  // }
}
