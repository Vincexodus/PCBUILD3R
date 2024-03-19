export interface UserPayment {
  _id: string;
  _userId: string;
  paymentType: string;
  provider: string;
  accountNo: string;
  expiry: Date;
  createdAt: Date;
  version: Number;
}
