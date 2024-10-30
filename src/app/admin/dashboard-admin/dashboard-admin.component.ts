import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe
  ]
})
export class DashboardAdminComponent {
  now = new Date();
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    revenue: 0
  };
}
