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
  createProduct(productCategoryId: string, productName: string, desc: string, sku: number, price: number) {
    return this.webReqService.post(`productCategory/${productCategoryId}/products`, { productName, desc, sku, price });
  }
  
  getProduct(productCategoryId: string) {
    return this.webReqService.get(`productCategory/${productCategoryId}/products`);
  }

  updateProduct(productCategoryId: string, productId: string,  productName: string, desc: string, sku: number, price: number) {
    return this.webReqService.patch(`productCategory/${productCategoryId}/products/${productId}`, { productName, desc, sku, price });
  }

  deleteProduct(productCategoryId: string, productId: string) {
    return this.webReqService.delete(`productCategory/${productCategoryId}/products/${productId}`);
  }

  // complete(task: Task) {
  //   return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
  //     completed: !task.completed
  //   });
  // }
}
