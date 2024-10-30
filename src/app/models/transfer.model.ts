export interface TransferRequest {
  destinationWalletId: string;
  amount: number;
}

export interface TransferResponse {
  id: string;
  status: string;
  amount: number;
  timestamp: Date;
}
