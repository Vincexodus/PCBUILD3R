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

  getCartItem(userId: string) {
    return this.webReqService.get(`cartItem/${userId}`);
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
}
