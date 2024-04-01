export interface Order {
  _id: string;
  _userId: string;
  _paymentd: string;
  total: { "$numberDecimal" : number };
  createdAt: Date;
  __v: Number;
}
