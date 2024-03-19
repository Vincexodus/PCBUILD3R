export interface OrderItems {
  _id: string;
  _orderId: string;
  _productId: string;
  quantity: number;
  createdAt: Date;
  version: Number;
}
