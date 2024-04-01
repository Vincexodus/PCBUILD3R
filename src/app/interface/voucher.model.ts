export interface Voucher {
  _id: string;
  key: string;
  percent: { "$numberDecimal" : number };
  active: boolean;
  createdAt: Date;
  __v: Number;
}
