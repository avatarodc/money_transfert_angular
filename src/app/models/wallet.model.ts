export interface Wallet {
  id: string;
  userId: string;
  balance: string | number; // Pour gérer le Decimal de Prisma
  currency: string;
  qrCode: string;
  isActive: boolean;
  plafond: string | number;
  dailyLimit: string | number | null;
  monthlyLimit: string | number | null;
  createdAt: string;
  updatedAt: string;
}
