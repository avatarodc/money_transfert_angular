import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from '../../services/user.service';
import { Transaction } from '../../models/transaction.model';
import { User } from '../../models/user.model';
import { RouterModule } from '@angular/router';
import { TransactionComponent } from '../transaction/transaction.component';


@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    RouterModule,
    TransactionComponent
  ],
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class QuickActionsComponent implements OnInit {
  isLoading = false;
  transactions: Transaction[] = [];
  sentTransactions: any[] = [];
  receivedTransactions: any[] = [];
  Math = Math;

  // Pagination parameters
  pageSize = 5;
  pageSizeOptions = [5, 10, 15, 20];

  // For sent transactions
  sentCurrentPage = 0;
  sentTotalItems = 0;
  paginatedSentTransactions: any[] = [];

  // For received transactions
  receivedCurrentPage = 0;
  receivedTotalItems = 0;
  paginatedReceivedTransactions: any[] = [];

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

          // Initialize pagination
          this.sentTotalItems = this.sentTransactions.length;
          this.receivedTotalItems = this.receivedTransactions.length;
          this.updatePaginatedTransactions();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur connecté:', error);
      }
    });
  }

  private updatePaginatedTransactions() {
    const sentStart = this.sentCurrentPage * this.pageSize;
    const receivedStart = this.receivedCurrentPage * this.pageSize;

    this.paginatedSentTransactions = this.sentTransactions.slice(
      sentStart,
      sentStart + this.pageSize
    );

    this.paginatedReceivedTransactions = this.receivedTransactions.slice(
      receivedStart,
      receivedStart + this.pageSize
    );
  }

  onSentPageChange(event: PageEvent) {
    this.sentCurrentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedTransactions();
  }

  onReceivedPageChange(event: PageEvent) {
    this.receivedCurrentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedTransactions();
  }

  showTransactions() {
    this.router.navigate(['/transactions']);
  }

  getFormattedRange(currentPage: number, pageSize: number, totalItems: number): string {
    const start = currentPage * pageSize + 1;
    const end = Math.min((currentPage + 1) * pageSize, totalItems);
    return `${start} - ${end} sur ${totalItems}`;
  }

  getStatusClass(status: string): string {
    return status === 'completed'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  }

  goToNewTransaction(): void {
    this.router.navigate(['/transaction']); // Ajustez le chemin selon votre configuration de routes
  }
}
