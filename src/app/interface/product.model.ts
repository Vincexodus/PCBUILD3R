export interface Product {
  _id: string;
  _productCategoryId: string;
  _inventoryId: string;
  _discountId: string;
  productName: string;
  productImage: string | ArrayBuffer | null;
  desc: string;
  price: { "$numberDecimal" : number };
  createdAt: Date;
  __v: Number;
}
