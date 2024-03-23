export interface User {
  _id: string;
  isAdmin: boolean;
  name: string;
  email: string;
  password: string;
  telephone: string;
  createdAt: Date;
  version: Number;
}
