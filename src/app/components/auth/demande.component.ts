import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DemandeService } from '../../services/demande.service';
import {AccountRequestStatus, Demande} from '../../models/demande.model';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-account-request',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './demande.component.html'
})
export class DemandeComponent {
  demande: Partial<Demande> = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    idCardFrontPhoto: '',
    idCardBackPhoto: '',
    status: AccountRequestStatus.PENDING
  };

  errorMessage: string = '';
  private idCardFrontFile?: File;
  private idCardBackFile?: File;

  constructor(private demandeService: DemandeService, private router: Router) {}

  onIdCardFrontSelected(event: any) {
    this.idCardFrontFile = event.target.files[0];
  }

  onIdCardBackSelected(event: any) {
    this.idCardBackFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.idCardFrontFile || !this.idCardBackFile) {
      this.errorMessage = 'Veuillez fournir les photos de votre carte d\'identité';
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.demande.firstName || '');
    formData.append('lastName', this.demande.lastName || '');
    formData.append('phoneNumber', this.demande.phoneNumber || '');
    formData.append('email', this.demande.email || '');
    formData.append('idCardFrontPhoto', this.idCardFrontFile);
    formData.append('idCardBackPhoto', this.idCardBackFile);

    this.demandeService.createDemande(formData).subscribe({
      next: (response) => {
        console.log('Demande soumise avec succès', response);
        // Rediriger vers une page de confirmation
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la soumission de la demande', error);
        this.errorMessage = 'Erreur lors de la soumission de la demande. Veuillez réessayer.';
      }
    });
  }
}
