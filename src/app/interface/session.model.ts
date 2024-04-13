export interface Session {
  _id: string;
  _userId: string;
  voucherKey: string;
  level: number;
  rating: number;
  desc: string;
  createdAt: Date;
  __v: Number;
}
