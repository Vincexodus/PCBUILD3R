export interface Product {
  _id: string;
  _productCategoryId: string;
  productName: string;
  productImage: string | ArrayBuffer | null;
  rating: { "$numberDecimal" : number };
  desc: string;
  price: { "$numberDecimal" : number };
  quantity: Number;
  createdAt: Date;
  __v: Number;
}
