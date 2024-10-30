import { User } from "./user.model";

export interface Contact {
  id: string;
  userId: string;
  contactId: string;
  nickname: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  contact: User;
}
