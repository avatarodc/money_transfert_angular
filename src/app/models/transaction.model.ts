export interface Transaction {
  id: string;
  senderWalletId: string;
  receiverWalletId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFERE' | 'INVOICE';
  reference: string;
  description?: string;
  feeAmount: number;
  feeCurrency?: string;
  createdAt: Date;
  updatedAt: Date;
}
