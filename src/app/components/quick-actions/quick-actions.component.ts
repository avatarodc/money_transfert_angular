import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from '../../services/user.service';
import { Transaction } from '../../models/transaction.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QuickActionsComponent implements OnInit {
  // actions = [
  //   { icon: 'group', label: 'Contacts', action: () => this.router.navigate(['/contacts']) },
  //   { icon: 'account_balance_wallet', label: 'Portefeuilles', action: () => this.router.navigate(['/wallets']) },
  //   { icon: 'history', label: 'Historique', action: () => this.showTransactions() },
  //   { icon: 'settings', label: 'Paramètres', action: () => this.router.navigate(['/settings']) }
  // ];

  isLoading = false;
  transactions: Transaction[] = [];
  sentTransactions: any[] = [];
  receivedTransactions: any[] = [];

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadTransactions();
    this.loadCurrentUser();
  }

  private loadTransactions() {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe(user => {
      this.transactionService.getAllTransactionsByUser(user.data.id).subscribe({
        next: (response) => {
          this.transactions = response.data;
          console.log("Transactions:", this.transactions);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des transactions:', error);
          this.isLoading = false;
        }
      });
    });
  }

  private loadCurrentUser() {
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        if (response.data.wallets && response.data.wallets.length > 0) {
          this.sentTransactions = response.data.wallets[0].sentTransactions;
          this.receivedTransactions = response.data.wallets[0].receivedTransactions;
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur connecté:', error);
      }
    });
  }

  showTransactions() {
    this.router.navigate(['/transactions']);
  }

  trackByLabel(index: number, action: any): string {
    return action.label;
  }
}
