import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.interface';
import { Wallet } from '../models/wallet.model';
import { TransferRequest, TransferResponse } from '../models/transfer.model';
import { Balance } from '../models/balance.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService extends ApiService {
  private readonly BASE_PATH = '/wallets';
  private readonly TRANSACTIONS_PATH = '/transactions';

  constructor(
    private userService: UserService
  ) {
    super(userService['http']);
  }

  getCurrentUserWallet(): Observable<ApiResponse<Wallet>> {
    return this.userService.getCurrentUser().pipe(
      map(response => {
        console.log('Informations utilisateur complètes:', response.data);
        if (response.data && response.data.wallets && response.data.wallets.length > 0) {
          return {
            success: true,
            message: 'Wallet trouvé',
            data: response.data.wallets[0],
            status: 200
          };
        }
        throw new Error('Aucun wallet trouvé');
      })
    );
  }

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
