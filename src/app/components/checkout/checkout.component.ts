import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Payment } from '../../interfaces/payment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.sass'
})
export class CheckoutComponent {
  cartItems: Payment[] = [
    { key: 'Gradient Graphic T-shirt', value: 565 },
    { key: 'Checkered Shirt', value: 180 },
    { key: 'Skinny Fit Jeans', value: 240 },
  ];
  payments: Payment[] = [
    { key: 'Sub Total', value: 565 },
    { key: 'Discount (-20%)', value: 113 },
    { key: 'Delivery Fee', value: 15 },
  ];

  isDiscount(str: string) {
    return str.startsWith("Discount");
  }
}
