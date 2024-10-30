export interface User {
  id: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address?: string;
  photo?: string;
  city?: string;
  country?: string;
  isVerified: boolean;
  isActive: boolean;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  profilePicture?: string; // optionnel, utilisera profileImage par défaut si non défini
  wallets?: Wallet[]; // ou définir un type plus précis si nécessaire
}

export enum UserRole {
  CLIENT = 'CLIENT',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN'
}


export interface Client extends User {
  idCardFrontPhoto: string;
  idCardBackPhoto: string;
  // Ajoutez d'autres propriétés spécifiques au client
}

export interface Agent extends User {
  agencyName?: string;
  // Ajoutez d'autres propriétés spécifiques à l'agent
}

// models/user-requests.model.ts
export interface CreateAgentRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  password: string;
  agencyName?: string;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  password: string;
  idCardFrontPhoto: File;
  idCardBackPhoto: File;
}

interface Transaction {
  id: string;
  senderWalletId: string;
  receiverWalletId: string;
  amount: string;
  currency: string;
  // ... autres propriétés si nécessaire
}

interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: string;
  plafond: string;
  qrCode: string;
  isActive: boolean;
  dailyLimit: string | null;
  monthlyLimit: string | null;
  createdAt: string;
  updatedAt: string;
  receivedTransactions: Transaction[];
  sentTransactions: Transaction[];
}

export interface User {
  // ... autres propriétés existantes ...
  wallets?: Wallet[];
}
