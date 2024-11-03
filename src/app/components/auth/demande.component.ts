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

    if (!this.demande.firstName || !this.demande.lastName || !this.demande.email || !this.demande.phoneNumber) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.demande.firstName);
    formData.append('lastName', this.demande.lastName);
    formData.append('phoneNumber', this.demande.phoneNumber);
    formData.append('email', this.demande.email);
    formData.append('idCardFrontPhoto', this.idCardFrontFile, this.idCardFrontFile.name);
    formData.append('idCardBackPhoto', this.idCardBackFile, this.idCardBackFile.name);
    formData.append('status', AccountRequestStatus.PENDING.toString());

    this.demandeService.createDemande(formData).subscribe({
      next: (response) => {
        console.log('Demande soumise avec succès', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur détaillée:', error);
        if (error.error?.error === 'cloud_name is disabled') {
          this.errorMessage = 'Erreur de configuration du service de stockage d\'images. Veuillez contacter l\'administrateur.';
        } else {
          this.errorMessage = `Erreur: ${error.error?.error || 'Une erreur est survenue'}`;
        }
      }
    });
  }
}
