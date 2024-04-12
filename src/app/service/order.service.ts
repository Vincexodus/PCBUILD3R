import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private webReqService: WebRequestService) { }

  private cartChangeSubject = new Subject<any>();
  cartChange$ = this.cartChangeSubject.asObservable();

  emitCartChange(value: any) {
    this.cartChangeSubject.next(value);
  }

  // Cart item route
  getCartItem(id: string) {
    return this.webReqService.get(`cartItem/${id}`);
  }

  getUnpaidCartItem(userId: string) {
    return this.webReqService.get(`cartItem/user/${userId}`);
  }

  createCartItem(_userId: string, _productId: string, quantity: Number) {
    return this.webReqService.post(`cartItem`, { _userId, _productId, quantity });
  }

  updateCartItem(_userId: string, _cartItemId: string, _productId: string, quantity: Number) {
    return this.webReqService.patch(`cartItem/${_cartItemId}`, { _userId, _productId, quantity });
  }

  deleteCartItem(_cartItemId: string) {
    return this.webReqService.delete(`cartItem/${_cartItemId}`);
  }

  private cartCheckoutSubject = new Subject<any>();
  cartCheckout$ = this.cartCheckoutSubject.asObservable();

  emitCartCheckout(value: any) {
    this.cartCheckoutSubject.next(value);
  }

  // Order route
  getOrder() {
    return this.webReqService.get(`order`);
  }

  getOrderByUserId(userId: string) {
    return this.webReqService.get(`order/${userId}`);
  }

  checkoutCart(_userId: string, _cartItemIds: string[], _voucherId: string, paymentMethod: string, total: number) {
    return this.webReqService.post(`order`, { _userId, _cartItemIds, _voucherId, paymentMethod, total });
  }

  // Voucher route
  getVoucher() {
    return this.webReqService.get(`voucher`);
  }

  getVoucherByKey(key: string) {
    return this.webReqService.get(`voucher/${key}`);
  }
  
  getVoucherByPercent(percent: number) {
    return this.webReqService.get(`voucher/${percent}`);
  }
  
  createVoucher(percent: number, active: boolean) {
    return this.webReqService.post(`voucher`, { percent, active });
  }

  updateVoucher(id: string, percent: number, active: boolean) {
    return this.webReqService.patch(`voucher/${id}`, { percent, active });
  }

  deleteVoucher(id: string) {
    return this.webReqService.delete(`voucher/${id}`);
  }
  
  claimVoucher(key: string) {
    return this.webReqService.patch(`voucher/claim`, {key});
  }

  // Product Review Routes
  getReview() {
    return this.webReqService.get(`review`);
  }

  getReviewByProductId(productId: string) {
    return this.webReqService.get(`review/${productId}`);
  }

  updateReview(_cartItemId: string, rating: string, desc: string) {
    return this.webReqService.patch(`review/${_cartItemId}`, { _cartItemId, rating, desc });
  }

  deleteReview(id: string) {
    return this.webReqService.delete(`review/${id}`);
  }
}
