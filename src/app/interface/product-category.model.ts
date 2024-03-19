export interface ProductCategory {
  _id: string;
  productCategoryName: string;
  productCategoryNameShort: string;
  productCategoryImage: string | ArrayBuffer | null;
  createdAt: Date;
  __v: Number;
}
