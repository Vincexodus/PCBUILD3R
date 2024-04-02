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

  // Order route
  getOrder() {
    return this.webReqService.get(`order`);
  }

  getOrderByUserId(userId: string) {
    return this.webReqService.get(`order/${userId}`);
  }

  checkoutCart(_userId: string, _cartItemIds: string[], voucherKey: string, paymentMethod: string, total: number) {
    return this.webReqService.post(`order`, { _userId, _cartItemIds, voucherKey, paymentMethod, total });
  }

  updateOrder(_userId: string, _cartItemId: string, _productId: string, quantity: Number) {
    return this.webReqService.patch(`order/${_cartItemId}`, { _userId, _productId, quantity });
  }

  deleteOrder(_cartItemId: string) {
    return this.webReqService.delete(`order/${_cartItemId}`);
  }

  // Voucher route
  getVoucher() {
    return this.webReqService.get(`voucher`);
  }

  getVoucherById(id: string) {
    return this.webReqService.get(`voucher/${id}`);
  }

  createVoucher(percent: number, active: boolean) {
    console.log(percent, " ", active);
    return this.webReqService.post(`voucher`, { percent, active });
  }

  updateVoucher(id: string, percent: number, active: boolean) {
    return this.webReqService.patch(`voucher/${id}`, { percent, active });
  }

  deleteVoucher(id: string) {
    return this.webReqService.delete(`voucher/${id}`);
  }
  
}
