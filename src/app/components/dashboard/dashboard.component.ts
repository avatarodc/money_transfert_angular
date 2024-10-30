import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { BalanceCardComponent } from '../balance-card/balance-card.component';
import { QuickActionsComponent } from '../quick-actions/quick-actions.component';
import { RecentTransactionsComponent } from '../recent-transactions/recent-transactions.component';
import { FooterComponent } from '../footer/footer.component';
import { DashboardAdminComponent } from '../../admin/dashboard-admin/dashboard-admin.component';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import {DemandeListComponent} from '../demande/demande-list.component';
import { ApiService } from '../../services/api.service';
import {ProfileComponent} from '../profile/profile.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    // BalanceCardComponent,
    QrCodeComponent,
    DashboardAdminComponent,
    QuickActionsComponent,
    RecentTransactionsComponent,
    DemandeListComponent,
    FooterComponent,
    ProfileComponent

  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  totalUsers: number = 0;
  todayTransactions: number = 0;

  constructor(public apiService: ApiService) {}
}
