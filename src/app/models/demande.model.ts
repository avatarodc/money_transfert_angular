// src/app/models/demande.model.ts
export interface Demande {
  id?: string; // Optionnel pour les nouvelles demandes (géré par le backend)
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  idCardFrontPhoto: string; // URLs des images ou Base64, selon votre besoin
  idCardBackPhoto: string;
  status: AccountRequestStatus; // Enum pour le statut
  createdAt?: Date; // Optionnel, rempli par le backend
  updatedAt?: Date; // Optionnel, rempli par le backend
}

// Enum des statuts (à adapter en fonction de l'implémentation backend)
export enum AccountRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
