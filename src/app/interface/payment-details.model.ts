export interface PaymentDetails {
  _id: string;
  _orderId: string;
  amount: number;
  status: string;
  createdAt: Date;
  version: Number;
}
