import { Component, Input } from '@angular/core';
import { ProductCounterComponent } from '../../utils/product-counter/product-counter.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shopping-cart-item',
  standalone: true,
  imports: [CommonModule, ProductCounterComponent],
  templateUrl: './shopping-cart-item.component.html',
  styleUrl: './shopping-cart-item.component.sass'
})
export class ShoppingCartItemComponent {
  @Input() productName: string = "";
  @Input() productDesc1: string = "";
  @Input() productDesc2: string = "";
  @Input() price: number = 0;
  @Input() subtotal: number = 0;
  @Input() islastItem: boolean = false;
}
