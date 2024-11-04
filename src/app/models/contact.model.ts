export interface Contact {
  id: string;
  userId: string;
  phoneNumber: string;
  nickname?: string;
  createdAt: Date;
  updatedAt: Date;
  contact?: {
    id: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    photo?: string;
  };
}
