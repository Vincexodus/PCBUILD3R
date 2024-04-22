export interface CartItem {
  _id: string;
  _userId: string;
  _productId: string;
  quantity: number;
  isPaid: boolean;
  createdAt: Date;
  __v: Number;
}
