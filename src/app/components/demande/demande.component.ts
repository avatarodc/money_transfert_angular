import { Component, OnInit } from '@angular/core';
import { DemandeService } from '../../services/demande.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Demande, AccountRequestStatus } from '../../models/demande.model';
import { HttpClient } from '@angular/common/http';
import { NgForOf, NgIf } from '@angular/common';
import { ProcessService } from '../../services/process.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-demande-list',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterModule,
    FooterComponent
  ],
  providers: [DemandeService, ProcessService],
  templateUrl: './demande.component.html'
})
export class DemandeListComponent implements OnInit {
  demandes: Demande[] = [];
  isAdmin: boolean = false;
  isLoading: boolean = false;
  isProcessing = false;

  constructor(
    private demandeService: DemandeService,
    private processService: ProcessService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadDemandes();
  }

  loadDemandes() {
    this.isLoading = true;
    this.demandeService.listDemandes().subscribe({
      next: (response) => {
        this.demandes = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes', error);
        this.isLoading = false;
      }
    });
  }

  updateStatus(id: string, status: AccountRequestStatus) {
    this.demandeService.updateStatus(id, status).subscribe({
      next: () => {
        this.loadDemandes();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut', error);
      }
    });
  }

  processApprovedRequests() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.processService.processDemande().subscribe({
      next: (response) => {
        console.log('Traitement des demandes approuvées effectué', response);
        this.loadDemandes();
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Erreur lors du traitement des demandes', error);
        this.isProcessing = false;
      }
    });
  }

  getStatusClass(status: AccountRequestStatus): string {
    switch (status) {
      case AccountRequestStatus.APPROVED:
        return 'px-2 py-1 text-green-800 bg-green-100 rounded-full';
      case AccountRequestStatus.REJECTED:
        return 'px-2 py-1 text-red-800 bg-red-100 rounded-full';
      default:
        return 'px-2 py-1 text-yellow-800 bg-yellow-100 rounded-full';
    }
  }

  protected readonly AccountRequestStatus = AccountRequestStatus;
}
