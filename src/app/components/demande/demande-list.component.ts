import { Component, OnInit } from '@angular/core';
import { DemandeService } from '../../services/demande.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Demande, AccountRequestStatus } from '../../models/demande.model';
import { HttpClient } from '@angular/common/http';
import {NgForOf, NgIf} from '@angular/common';
import {ProcessService} from '../../services/process.service';

@Component({
  selector: 'app-demande-list',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  template: `
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-7xl mx-auto">
        <div class="bg-white shadow-xl rounded-lg overflow-hidden">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-gray-800">Gestion des demandes</h2>
              <button (click)="processApprovedRequests()"
                      class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Traiter les demandes approuvées
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions
                  </th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let demande of demandes">
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ demande.firstName }} {{ demande.lastName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ demande.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ demande.phoneNumber }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                      <span [class]="getStatusClass(demande.status)">
                        {{ demande.status }}
                      </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <a [href]="demande.idCardFrontPhoto" target="_blank"
                         class="text-blue-600 hover:text-blue-800">Recto</a>
                      <a [href]="demande.idCardBackPhoto" target="_blank"
                         class="text-blue-600 hover:text-blue-800">Verso</a>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <button *ngIf="demande.status === 'PENDING'"
                              (click)="updateStatus(demande.id!, AccountRequestStatus.APPROVED)"
                              class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                        Approuver
                      </button>
                      <button *ngIf="demande.status === 'PENDING'"
                              (click)="updateStatus(demande.id!, AccountRequestStatus.REJECTED)"
                              class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                        Rejeter
                      </button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DemandeListComponent implements OnInit {
  demandes: Demande[] = [];

  isAdmin: boolean = false;

  constructor(
    private demandeService: DemandeService,

    private processService: ProcessService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadDemandes(); // Charger les demandes au démarrage
  }

  loadDemandes() {
    this.demandeService.listDemandes().subscribe({
      next: (response) => {
        this.demandes = response.data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des demandes', error);
      }
    });
  }

  updateStatus(id: string, status: AccountRequestStatus) {
    this.demandeService.updateStatus(id, status).subscribe({
      next: () => {
        this.loadDemandes(); // Recharger la liste
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut', error);
      }
    });
  }

  processApprovedRequests() {

    this.processService.processDemande().subscribe({
      next: (response) => {
        console.log('Traitement des demandes approuvées effectué', response);
        this.loadDemandes(); // Recharger la liste après le traitement
      },
      error: (error) => {
        console.error('Erreur lors du traitement des demandes', error);
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
