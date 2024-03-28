import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.sass'
})
export class ProductCardComponent {
  @Input() redirect : string = "";
  @Input() imageUrl: string | ArrayBuffer | null = "";
  @Input() productName: string = "";
  @Input() rating: number = 0;
  @Input() price: number = 0;
  
}
