import { Component, Input } from '@angular/core';
import { ProductCounterComponent } from '../utils/product-counter/product-counter.component';
import { ProductRatingComponent } from '../utils/product-rating/product-rating.component';
import { ProductReviewComponent } from '../product-review/product-review.component';
import { ProductSlideshowComponent } from '../product-slideshow/product-slideshow.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ProductRatingComponent, ProductCounterComponent, ProductReviewComponent, ProductSlideshowComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.sass'
})
export class ProductDetailComponent {
  @Input() productName: string = "Nvidia GEForce RTX3060";
  @Input() productRating: number = 4.5;
  @Input() stockQuantity: number = 1000;
  @Input() price: number = 360;
  @Input() productDesc: string = "This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric. If offers superior comfort and style.";
}
