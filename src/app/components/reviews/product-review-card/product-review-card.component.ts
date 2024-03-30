import { Component, Input } from '@angular/core';
import { ProductRatingComponent } from '../../utils/product-rating/product-rating.component';

@Component({
  selector: 'app-product-review-card',
  standalone: true,
  imports: [ProductRatingComponent],
  templateUrl: './product-review-card.component.html',
  styleUrl: './product-review-card.component.sass'
})
export class ProductReviewCardComponent {
  @Input() reviewRating: number = 4.5;
  @Input() reviewUser: string = "Samantha D.";
  @Input() reviewDes: string = "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt.";
}
