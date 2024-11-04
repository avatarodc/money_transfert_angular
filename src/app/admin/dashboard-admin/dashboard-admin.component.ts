import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DemandeListComponent } from '../../components/demande/demande.component';
import { TotalProfitComponent } from '../../components/total-profit/total-profit.component';
import { DemandeService } from '../../services/demande.service';
import { UserListComponent } from '../../components/users/user-list/user-list.component';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    DemandeListComponent,
    RouterModule,
    TotalProfitComponent,
    UserListComponent
  ]
})
export class DashboardAdminComponent implements OnInit {
  now = new Date();
  totalDemandes: number = 0;

  constructor(private demandeService: DemandeService) {}

  ngOnInit() {
    this.loadDemandesCount();
  }

  loadDemandesCount() {
    this.demandeService.getDemandesCount().subscribe({
      next: (response) => {
        this.totalDemandes = response;
        console.log("this.totalDemandes", this.totalDemandes);

      },
      error: (error) => {
        console.error('Erreur lors du chargement du nombre de demandes', error);
        this.totalDemandes = 0;
      }
    });
  }
}
