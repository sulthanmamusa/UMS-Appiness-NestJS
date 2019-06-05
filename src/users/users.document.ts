import { Document } from 'mongoose';

export interface UsersDocument extends Document {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: array;
  token?: string;
  url?: string;
  gender?: string;
  comments?: string;
  adhaar?: number;
}
