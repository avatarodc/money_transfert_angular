import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { BalanceCardComponent } from '../balance-card/balance-card.component';
import { QuickActionsComponent } from '../quick-actions/quick-actions.component';
import { RecentTransactionsComponent } from '../recent-transactions/recent-transactions.component';
import { FooterComponent } from '../footer/footer.component';
import { DashboardAdminComponent } from '../../admin/dashboard-admin/dashboard-admin.component';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { ApiService } from '../../services/api.service';

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
    FooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  totalUsers: number = 0;
  todayTransactions: number = 0;

  constructor(public apiService: ApiService) {}
}
