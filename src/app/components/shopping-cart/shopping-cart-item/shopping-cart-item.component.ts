import { Component, Input, OnInit } from '@angular/core';
import { ProductCounterComponent } from '../../utils/product-counter/product-counter.component';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../service/order.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-shopping-cart-item',
  standalone: true,
  imports: [CommonModule, ProductCounterComponent],
  templateUrl: './shopping-cart-item.component.html',
  styleUrl: './shopping-cart-item.component.sass'
})
export class ShoppingCartItemComponent implements OnInit {
  @Input() userId: string = "";
  @Input() cartItemId: string = "";
  @Input() imageUrl: string | ArrayBuffer | null = "";
  @Input() productId: string = "";
  @Input() productName: string = "";
  @Input() productDesc: string = "";
  @Input() price: number = 0;
  @Input() quantity: number = 0;
  subtotal: number = 0;
  deleteModalStates: { [cartItemId: string]: boolean } = {};

  constructor(private orderService: OrderService, private toast: NgToastService) { }
  
  ngOnInit(): void {
    this.subtotal = parseFloat((this.price * this.quantity).toFixed(2));
  }

  openDeleteModal(cartItemId: string) {
    this.deleteModalStates[cartItemId] = true;
  }

  closeDeleteModal(categoryId: string) {
    this.deleteModalStates[categoryId] = false;
  }

  onCounterChange(value: number) {
    this.subtotal = parseFloat((this.price * value).toFixed(2));
    this.updateCartItem(this.cartItemId, value);
    this.orderService.emitCartChange(true);
  }

  updateCartItem(cartItemId: string, quantity: Number) {
    this.orderService.updateCartItem(this.userId, cartItemId, this.productId, quantity).subscribe(() => {
      this.toast.success({detail:"SUCCESS",summary:'Cart Item Updated!', duration:2000, position:'topCenter'});
    }, (error) => {
      console.log(error);
    })
  }
  
  deleteCartItem(cartItemId: string) {
    this.orderService.deleteCartItem(cartItemId).subscribe(() => {
      this.toast.success({detail:"SUCCESS",summary:'Cart Item Deleted!', duration:2000, position:'topCenter'});
      this.closeDeleteModal(cartItemId);
      this.orderService.emitCartChange(true);
    }, (error) => {
      console.log(error);
    })
  }
}
