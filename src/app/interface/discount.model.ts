export interface Discount {
  _id: string;
  name: string;
  desc: number;
  discount_percent: number;
  active: boolean;
  createdAt: Date;
  __v: Number;
}
