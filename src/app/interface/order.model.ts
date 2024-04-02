import { CartItem } from "./cart-item.model";

export interface Order {
  _id: string;
  _userId: string;
  _cartItemIds: string[];
  cartItems: CartItem[];
  _voucherId: string;
  paymentMethod: string;
  total: { "$numberDecimal" : number };
  createdAt: Date;
  __v: Number;
}
