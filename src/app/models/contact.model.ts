import { User } from "./user.model";

export interface Contact {
  id: string;
  userId: string;
  contactId: string;
  nickname: string | null;
  phoneNumber: string;
  nickname?: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  contact: User;
  contact?: {
    id: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    photo?: string;
  };
}
