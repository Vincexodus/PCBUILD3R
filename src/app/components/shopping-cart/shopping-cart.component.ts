import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ShoppingCartItemComponent } from './shopping-cart-item/shopping-cart-item.component';
import { Payment } from '../../interfaces/payment';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, ShoppingCartItemComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.sass'
})

export class ShoppingCartComponent {
  @Input() show: boolean = false;
  
  payments: Payment[] = [
    { key: 'Sub Total', value: 565 },
    { key: 'Discount (-20%)', value: 113 },
    { key: 'Delivery Fee', value: 15 },
  ];

  isDiscount(str: string) {
    return str.startsWith("Discount");
  }
}