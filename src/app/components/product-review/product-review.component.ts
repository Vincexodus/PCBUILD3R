import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductReviewCardComponent } from '../product-review-card/product-review-card.component';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductReviewCardComponent],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.sass'
})
export class ProductReviewComponent {
  isDetails: boolean = false;
  isDropdownActive = false;
  @Input() productName: string = "productName";
  @Input() productDescription: string = "productDescription";
  @Input() productFeatures: string = "productFeatures";

  toggleDetails(value: boolean): void {
    this.isDetails = value;
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }
}
