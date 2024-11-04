import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { ContactsComponent } from '../../contacts/contacts.component';
import { TransactionService } from '../../../services/transaction.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

interface Transaction {
  date: string;
  clientName: string;
  type: 'Dépôt' | 'Retrait';
  amount: number;
  status: 'Complété' | 'En cours' | 'Échoué';
}

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FooterComponent,
    FormsModule,
    ContactsComponent
  ],
})
export class AgentDashboardComponent implements OnInit {
  // Variables pour contrôler l'affichage des modals
  isDepositModalOpen: boolean = false;
  isWithdrawalModalOpen: boolean = false;
  isCreateClientModalOpen: boolean = false;

  // Statistiques
  totalTransactions: number = 156;
  totalClients: number = 45;
  totalBalance: number = 24500;

  // Transactions exemple
  transactions: Transaction[] = [
    {
      date: '2024-11-03',
      clientName: 'Marie Dupont',
      type: 'Dépôt',
      amount: 1500,
      status: 'Complété'
    },
    // ... autres transactions
  ];

  // Ajoutez ces nouvelles propriétés
  selectedUser: User | null = null;
  selectedUserFullName: string = '';

  depositAmount: number = 0;
  depositDescription: string = '';

  currentUser: User | null = null;

  withdrawalAmount: number = 0;
  withdrawalDescription: string = '';

  isLoading = false;
  showSuccessNotification = false;
  successMessage = '';

  constructor(
    private apiService: ApiService,
    private transactionService: TransactionService,
    private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        this.currentUser = response.data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    });
  }

  // Méthodes pour les modals
  openDepositModal(): void {
    if (!this.selectedUser) {
      alert('Veuillez sélectionner un client d\'abord');
      return;
    }
    this.isDepositModalOpen = true;
  }

  openWithdrawalModal(): void {
    this.isWithdrawalModalOpen = true;
  }

  openCreateClientModal(): void {
    this.isCreateClientModalOpen = true;
  }

  // Méthodes de soumission des formulaires
  submitDeposit(): void {
    if (!this.currentUser?.wallets?.[0]?.id || !this.selectedUser?.wallets?.[0]?.id) {
      console.error('Wallet non trouvé');
      return;
    }

    this.isLoading = true;
    const depositData = {
      senderWalletId: this.currentUser.wallets[0].id,
      receiverWalletId: this.selectedUser.wallets[0].id,
      amount: this.depositAmount,
      description: this.depositDescription,
      currency: 'FCFA'
    };

    console.log('Données du dépôt à envoyer:', depositData);

    this.transactionService.createDeposit(depositData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isDepositModalOpen = false;
        this.showSuccess('Dépôt effectué avec succès !');
        this.depositAmount = 0;
        this.depositDescription = '';
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Détails de l\'erreur:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        alert('Erreur lors du dépôt. Veuillez réessayer.');
      }
    });
  }

  submitWithdrawal(): void {
    if (!this.currentUser?.wallets?.[0]?.id || !this.selectedUser?.wallets?.[0]?.id) {
      console.error('Wallets non trouvés');
      return;
    }

    this.isLoading = true;
    const withdrawalData = {
      senderWalletId: this.selectedUser.wallets[0].id,
      receiverWalletId: this.currentUser.wallets[0].id,
      amount: this.withdrawalAmount,
      description: this.withdrawalDescription,
      currency: 'FCFA'
    };

    this.transactionService.createWithdrawal(withdrawalData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isWithdrawalModalOpen = false;
        this.showSuccess('Retrait effectué avec succès !');
        this.withdrawalAmount = 0;
        this.withdrawalDescription = '';
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur lors du retrait:', error);
      }
    });
  }

  submitCreateClient(): void {
    // Logique pour créer un client
    this.isCreateClientModalOpen = false;
  }

  // Ajoutez cette méthode pour gérer la sélection d'un utilisateur
  onUserSelected(user: any): void {
    console.log('Dashboard received user:', user);
    this.selectedUser = user;
    this.selectedUserFullName = `${user.firstName} ${user.lastName}`;
    // Forcer la détection des changements si nécessaire
    this.changeDetectorRef.detectChanges();
  }

  // Méthode pour afficher la notification
  private showSuccess(message: string) {
    this.successMessage = message;
    this.showSuccessNotification = true;
    setTimeout(() => {
      this.showSuccessNotification = false;
    }, 3000); // Disparaît après 3 secondes
  }
}
