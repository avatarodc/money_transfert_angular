import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { FooterComponent } from '../footer/footer.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { User } from '../../models/user.model';
import { TransactionService } from '../../services/transaction.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  templateUrl: './transaction.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContactsComponent,
    FooterComponent
  ]
})
export class TransactionComponent implements OnInit {
  transactionForm!: FormGroup;
  balanceForm!: FormGroup;
  adminTransferForm!: FormGroup;
  isLoading = false;
  selectedUser: any = null;
  successfulTransaction: any = null;
  transactionStats: any = null;
  transactionType: 'transfer' | 'balance' | 'admin-transfer' = 'transfer';
  pendingTransactions: any[] = [];
  showPendingTransactions = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private userService: UserService,
    public apiService: ApiService
  ) {
    this.initializeForms();
    this.loadCurrentUserWallet();
    if (this.apiService.isAdmin()) {
      this.loadTransactionStats();
      this.loadPendingTransactions();
    }
  }

  private initializeForms() {
    // Formulaire de transfert standard
    this.transactionForm = this.fb.group({
      recipient: ['', Validators.required],
      senderWalletId: ['', Validators.required],
      receiverWalletId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });

    // Formulaire d'ajout de solde (admin)
    this.balanceForm = this.fb.group({
      userAgentWalletId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required]
    });

    // Formulaire de transfert admin
    this.adminTransferForm = this.fb.group({
      senderWalletId: ['', Validators.required],
      receiverWalletId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      transactionType: ['TRANSFERE', Validators.required]
    });
  }

  private loadCurrentUserWallet() {
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        const currentUser = response.data;
        if (currentUser?.wallets && currentUser.wallets.length > 0) {
          this.transactionForm.patchValue({
            senderWalletId: currentUser.wallets[0].id
          });
          this.adminTransferForm.patchValue({
            senderWalletId: currentUser.wallets[0].id
          });
        }
      },
      error: (error) => console.error('Erreur lors du chargement du wallet:', error)
    });
  }

  private loadTransactionStats() {
    this.transactionService.getTransactionStats().subscribe({
      next: (response) => {
        this.transactionStats = response.data;
      },
      error: (error) => console.error('Erreur lors du chargement des statistiques:', error)
    });
  }

  private loadPendingTransactions() {
    this.transactionService.getPendingTransactions().subscribe({
      next: (response) => {
        this.pendingTransactions = response.data;
      },
      error: (error) => console.error('Erreur lors du chargement des transactions en attente:', error)
    });
  }

  ngOnInit(): void {}

  onUserSelected(user: any) {
    this.selectedUser = user;
    // Mise à jour des formulaires
    this.transactionForm.patchValue({
      recipient: user.phoneNumber,
      receiverWalletId: user.wallets?.[0]?.id
    });
    this.balanceForm.patchValue({
      userAgentWalletId: user.wallets?.[0]?.id
    });
    this.adminTransferForm.patchValue({
      receiverWalletId: user.wallets?.[0]?.id
    });
  }

  onSubmit() {
    switch (this.transactionType) {
      case 'transfer':
        this.handleTransfer();
        break;
      case 'balance':
        this.handleBalanceAdd();
        break;
      case 'admin-transfer':
        this.handleAdminTransfer();
        break;
    }
  }

  private handleTransfer() {
    if (this.transactionForm.valid) {
      this.isLoading = true;
      const transferData = {
        senderWalletId: this.transactionForm.get('senderWalletId')?.value,
        receiverWalletId: this.transactionForm.get('receiverWalletId')?.value,
        amount: Number(this.transactionForm.get('amount')?.value),
        currency: 'FCFA'
      };

      const transferMethod = this.apiService.isAdmin()
        ? this.transactionService.createAdminTransfer(transferData)
        : this.transactionService.createTransfer(transferData);

      transferMethod.subscribe({
        next: (response) => {
          this.handleTransactionSuccess('Transfert', this.transactionForm.value);
          if (this.apiService.isAdmin()) {
            this.loadTransactionStats();
          }
        },
        error: this.handleTransactionError,
        complete: () => this.isLoading = false
      });
    }
  }

  private handleBalanceAdd() {
    if (this.balanceForm.valid) {
      this.isLoading = true;
      const balanceData = {
        userAgentWalletId: this.balanceForm.get('userAgentWalletId')?.value,
        amount: Number(this.balanceForm.get('amount')?.value),
        description: this.balanceForm.get('description')?.value
      };

      this.transactionService.addBalanceToUserAgent(balanceData).subscribe({
        next: (response) => {
          this.handleTransactionSuccess('Ajout de solde', this.balanceForm.value);
          this.loadTransactionStats();
        },
        error: this.handleTransactionError,
        complete: () => this.isLoading = false
      });
    }
  }

  private handleAdminTransfer() {
    if (this.adminTransferForm.valid) {
      this.isLoading = true;
      const adminTransferData = {
        senderWalletId: this.adminTransferForm.get('senderWalletId')?.value,
        receiverWalletId: this.adminTransferForm.get('receiverWalletId')?.value,
        amount: Number(this.adminTransferForm.get('amount')?.value),
        currency: 'FCFA'
      };

      this.transactionService.createAdminTransfer(adminTransferData).subscribe({
        next: (response) => {
          this.handleTransactionSuccess('Transfert administratif', this.adminTransferForm.value);
          this.loadTransactionStats();
        },
        error: this.handleTransactionError,
        complete: () => this.isLoading = false
      });
    }
  }

  private handleTransactionSuccess(type: string, formData: any) {
    console.log(`${type} réussi:`, formData);
    this.successfulTransaction = {
      type: type,
      recipient: this.selectedUser?.phoneNumber,
      amount: formData.amount,
      description: formData.description,
      createdAt: new Date()
    };
    this.resetForms();
    if (this.apiService.isAdmin()) {
      this.loadPendingTransactions();
    }
  }

  private handleTransactionError = (error: any) => {
    console.error('Erreur lors de la transaction:', error);
    // Ici vous pouvez ajouter une gestion des erreurs plus sophistiquée
  }

  private resetForms() {
    this.transactionForm.reset();
    this.balanceForm.reset();
    this.adminTransferForm.reset();
    this.selectedUser = null;
  }

  // Méthodes pour les transactions en attente (admin)
  approveTransaction(transactionId: string) {
    this.transactionService.approveTransaction(transactionId).subscribe({
      next: () => {
        this.loadPendingTransactions();
        this.loadTransactionStats();
      },
      error: (error) => console.error('Erreur lors de l\'approbation:', error)
    });
  }

  rejectTransaction(transactionId: string) {
    const reason = prompt('Raison du rejet:');
    if (reason) {
      this.transactionService.rejectTransaction(transactionId, reason).subscribe({
        next: () => {
          this.loadPendingTransactions();
          this.loadTransactionStats();
        },
        error: (error) => console.error('Erreur lors du rejet:', error)
      });
    }
  }

  togglePendingTransactions() {
    this.showPendingTransactions = !this.showPendingTransactions;
    if (this.showPendingTransactions) {
      this.loadPendingTransactions();
    }
  }

  // Méthode pour formater les montants en FCFA
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
