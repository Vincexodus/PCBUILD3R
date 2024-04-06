import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-rating.component.html',
  styleUrl: './product-rating.component.sass'
})

export class ProductRatingComponent {
  @Input() rating: number = 0;

  getStarsArray(rating: number): number[] {
    const starsArray = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      starsArray.push(i);
    }

    return starsArray;
  }

  getRemainingStarsArray(rating: number): number[] {
    const starsArray = [];

    for (let i = 0; i < (5 - rating); i++) {
      starsArray.push(i);
    }
    return starsArray;
  }
}
