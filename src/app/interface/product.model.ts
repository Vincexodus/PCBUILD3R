export interface Product {
  _id: string;
  _productCategoryId: string;
  _inventoryId: string;
  _discountId: string;
  productName: string;
  desc: string;
  price: number;
  createdAt: Date;
  version: Number;
}
