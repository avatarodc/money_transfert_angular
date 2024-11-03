import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-total-profit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card des frais -->
      <div class="bg-white rounded-xl shadow-md p-4">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="text-gray-600 text-sm">Total des frais</h2>
            <p class="text-2xl font-semibold">{{formatFCFA(totalFees)}}</p>
          </div>
        </div>
      </div>

      <!-- Card des transferts -->
      <div class="bg-white rounded-xl shadow-md p-4">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="text-gray-600 text-sm">Total Transferts</h2>
            <p class="text-2xl font-semibold">{{formatFCFA(transferAmount)}}</p>
            <p class="text-xs text-gray-500">{{transferCount}} transactions</p>
          </div>
        </div>
      </div>

      <!-- Card des dépôts -->
      <div class="bg-white rounded-xl shadow-md p-4">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="text-gray-600 text-sm">Total Dépôts</h2>
            <p class="text-2xl font-semibold">{{formatFCFA(depositAmount)}}</p>
            <p class="text-xs text-gray-500">{{depositCount}} transactions</p>
          </div>
        </div>
      </div>

      <!-- Card des retraits -->
      <div class="bg-white rounded-xl shadow-md p-4">
        <div class="flex items-center">
          <div class="p-3 bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <div class="ml-4">
            <h2 class="text-gray-600 text-sm">Total Retraits</h2>
            <p class="text-2xl font-semibold">{{formatFCFA(withdrawalAmount)}}</p>
            <p class="text-xs text-gray-500">{{withdrawalCount}} transactions</p>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="isLoading" class="text-center mt-4">
      <p class="text-sm text-gray-500">Chargement...</p>
    </div>
  `
})
export class TotalProfitComponent implements OnInit {
  totalFees: number = 0;
  totalTransactions: number = 0;
  depositCount: number = 0;
  depositAmount: number = 0;
  withdrawalCount: number = 0;
  withdrawalAmount: number = 0;
  transferCount: number = 0;
  transferAmount: number = 0;
  lastUpdate: Date = new Date();
  isLoading: boolean = true;

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadTransactionData();
  }

  formatFCFA(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  loadTransactionData() {
    this.isLoading = true;
    this.transactionService.getAllTransactions().subscribe({
      next: (response) => {
        if (response.data) {
          this.calculateStatistics(response.data);
        }
        this.lastUpdate = new Date();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des transactions', error);
        this.isLoading = false;
      }
    });
  }

  private calculateStatistics(transactions: Transaction[]) {
    // Réinitialiser les compteurs
    this.totalTransactions = transactions.length;
    this.depositCount = 0;
    this.depositAmount = 0;
    this.withdrawalCount = 0;
    this.withdrawalAmount = 0;
    this.transferCount = 0;
    this.transferAmount = 0;
    this.totalFees = 0;

    // Calculer les statistiques
    transactions.forEach(transaction => {
      // Ajouter les frais
      this.totalFees += Number(transaction.feeAmount) || 0;

      switch (transaction.type) {
        case 'DEPOSIT':
          this.depositCount++;
          this.depositAmount += Number(transaction.amount);
          break;
        case 'WITHDRAWAL':
          this.withdrawalCount++;
          this.withdrawalAmount += Number(transaction.amount);
          break;
        case 'TRANSFERE':
          this.transferCount++;
          // console.log(transaction.amount);
          this.transferAmount += Number(transaction.amount);
          break;
      }
    });

    // Log des statistiques dans la console
    // console.log('Statistiques détaillées:');
    // console.log(`Total des frais: ${this.formatFCFA(this.totalFees)}`);
    // console.log(`Total des transferts: ${this.formatFCFA(this.transferAmount)} (${this.transferCount} transactions)`);
    // console.log(`Total des dépôts: ${this.formatFCFA(this.depositAmount)} (${this.depositCount} transactions)`);
    // console.log(`Total des retraits: ${this.formatFCFA(this.withdrawalAmount)} (${this.withdrawalCount} transactions)`);
  }
}
