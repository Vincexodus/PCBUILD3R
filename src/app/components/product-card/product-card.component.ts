import { Component, Input } from '@angular/core';
import { ProductRatingComponent } from '../utils/product-rating/product-rating.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, ProductRatingComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.sass'
})
export class ProductCardComponent {
  @Input() productId : string = "";
  @Input() imageUrl: string | ArrayBuffer | null = "";
  @Input() productName: string = "";
  @Input() rating: number = 0;
  @Input() price: number = 0;
  @Input() quantity: Number = 0;
}
