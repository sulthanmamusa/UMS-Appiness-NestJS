export interface Users {
  _id: string;
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