import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductReviewCardComponent } from '../reviews/product-review-card/product-review-card.component';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductReviewCardComponent],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.sass'
})
export class ProductReviewComponent {
  @Input() totalReviews: number = 0;
  isDropdownActive = false;

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }
}
