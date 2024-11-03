import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { BalanceCardComponent } from '../balance-card/balance-card.component';
import { QuickActionsComponent } from '../quick-actions/quick-actions.component';
import { RecentTransactionsComponent } from '../recent-transactions/recent-transactions.component';
import { FooterComponent } from '../footer/footer.component';
import { DashboardAdminComponent } from '../../admin/dashboard-admin/dashboard-admin.component';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { ApiService } from '../../services/api.service';
import { TransactionComponent } from '../transaction/transaction.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { LoadingService } from '../../services/loading.service';
import { DemandeListComponent } from '../demande/demande.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    // BalanceCardComponent,
    QrCodeComponent,
    ContactsComponent,
    DashboardAdminComponent,
    QuickActionsComponent,
    RecentTransactionsComponent,
    FooterComponent,
    TransactionComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalUsers: number = 0;
  todayTransactions: number = 0;
  isLoading = true;
  private componentsToLoad = ['qrCode', 'quickActions', 'recentTransactions'];

  constructor(
    public apiService: ApiService,
    private loadingService: LoadingService
  ) {
    // Enregistrer tous les composants à charger
    this.componentsToLoad.forEach(component => {
      this.loadingService.registerComponent(component);
    });

    this.loadingService.isLoading().subscribe(
      loading => this.isLoading = loading
    );
  }

  ngOnInit() {
    // Simuler un délai de chargement ou attendre que tous les composants soient chargés
    Promise.all([
      // Ajoutez ici les promesses de chargement de vos composants si nécessaire
    ]).finally(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 1000); // Délai minimum de 1 seconde pour éviter un flash
    });
  }

  ngOnDestroy() {
    // Nettoyage des ressources si nécessaire
  }
}
