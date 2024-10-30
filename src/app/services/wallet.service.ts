import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.interface';
import { Wallet } from '../models/wallet.model';
import { TransferRequest, TransferResponse } from '../models/transfer.model';
import { Balance } from '../models/balance.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService extends ApiService {
  private readonly BASE_PATH = '/wallets';
  private readonly TRANSACTIONS_PATH = '/transactions';

  getUserWallet(): Observable<ApiResponse<Wallet>> {
    return this.get<Wallet>(`${this.BASE_PATH}/user`);
  }

  getBalance(): Observable<ApiResponse<Balance>> {
    return this.get<Balance>(`${this.BASE_PATH}/balance`);
  }

  transfer(transferData: TransferRequest): Observable<ApiResponse<TransferResponse>> {
    return this.post<TransferResponse>(
      `${this.TRANSACTIONS_PATH}/transfer`,
      transferData
    );
  }

  // Méthodes additionnelles que vous pourriez ajouter
  getTransactionHistory(walletId: string): Observable<ApiResponse<TransferResponse[]>> {
    return this.get<TransferResponse[]>(`${this.TRANSACTIONS_PATH}/history/${walletId}`);
  }

  getWalletDetails(walletId: string): Observable<ApiResponse<Wallet>> {
    return this.get<Wallet>(`${this.BASE_PATH}/${walletId}`);
  }

  getCurrentBalance(): Observable<Wallet> {
    // Implémentez votre logique ici
    return this.http.get<Wallet>('/api/wallet/balance');  // exemple
  }
}
