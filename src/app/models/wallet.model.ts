export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  qrCode: string;
  balance: number;
  isActive: boolean;
  dailyLimit?: number;
  monthlyLimit?: number;
  plafond?: number;
  updatedAt: Date;
}
