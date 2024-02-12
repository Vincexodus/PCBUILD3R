import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.sass'
})
export class ProductCardComponent {
  @Input() imageUrl: string = "";
  @Input() productName: string = "";
  @Input() rating: number = 0;
  @Input() price: number = 0;
  
}
