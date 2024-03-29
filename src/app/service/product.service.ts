import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private webReqService: WebRequestService) { }

  // Product Category Routes
  getProductCategory() {
    return this.webReqService.get('productCategory');
  }

  createProductCategory(productCategoryName: string, productCategoryNameShort: string, productCategoryImage: string | ArrayBuffer | null) {
    return this.webReqService.post('productCategory', { productCategoryName, productCategoryNameShort, productCategoryImage });
  }

  updateProductCategory(id: string, productCategoryName: string, productCategoryNameShort: string, productCategoryImage: string | ArrayBuffer | null) {
    return this.webReqService.patch(`productCategory/${id}`, { productCategoryName, productCategoryNameShort, productCategoryImage });
  }

  deleteProductCategory(id: string) {
    return this.webReqService.delete(`productCategory/${id}`);
  }

  // Product Routes
  getProduct() {
    return this.webReqService.get(`product`);
  }

  getProductById(productId: string) {
    return this.webReqService.get(`product/${productId}`);
  }
  
  getLatestProduct() {
    return this.webReqService.get(`product/latest`);
  }
  
  getTopProduct() {
    return this.webReqService.get(`product/top`);
  }
  
  getCommonProduct(productId: string) {
    return this.webReqService.get(`product/common/${productId}`);
  }

  createProduct(_productCategoryId: string, productName: string, productImage: string | ArrayBuffer | null, 
                desc: string, price: Number, quantity: Number) {
    return this.webReqService.post(`product`, { _productCategoryId, productName, productImage, desc, price, quantity });
  }

  updateProduct(productId: string, _productCategoryId: string, productName: string, productImage: string | ArrayBuffer | null, 
                desc: string, price: Number, quantity: Number) {
    return this.webReqService.patch(`product/${productId}`, { _productCategoryId, productName, productImage, desc, price, quantity });
  }

  deleteProduct(productId: string) {
    return this.webReqService.delete(`product/${productId}`);
  }

  // Product Review Routes
  getProductReview(productId: string) {
    return this.webReqService.get(`review/${productId}`);
  }
}
