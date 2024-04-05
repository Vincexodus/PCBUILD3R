import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../service/product.service';
import { Review } from '../../interface/review.model';
import { forkJoin, Observable } from 'rxjs';
import { CartItem } from '../../interface/cart-item.model';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';
import { User } from '../../interface/user.model';
import { ProductRatingComponent } from '../utils/product-rating/product-rating.component';
import { UtilService } from '../../service/util.service';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductRatingComponent],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.sass'
})
export class ProductReviewComponent implements OnInit {
  @Input() productId: string = "";
  @Input() totalReviews: number = 0;
  reviews: Review[] = [];
  reviewChunks: any[][] = [];
  isDropdownActive = false;

  constructor(private productService: ProductService, private orderService: OrderService, private userService: UserService,
              private util: UtilService) { }
  
  ngOnInit() {
    this.getProductReviews(this.productId);
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  maskReview(input: string | undefined): string {
    return this.util.maskReviewUser(input);
  }

  chunkArray(array: any[], size: number): any[][] {
    const chunks = [];
    if (array) {
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
    }
    return chunks;
  }

  getProductReviews(productId: string) {
    this.orderService.getReviewByProductId(productId).subscribe((reviews: Review[]) => {
      // Array to store observables for fetching cartItems and users
      const cartItemObservables: Observable<any>[] = [];
      
      // Loop through each review
      reviews.forEach(review => {
        // Push an observable to fetch cartItem for each review's cartItemId
        cartItemObservables.push(this.orderService.getCartItem(review._cartItemId));
      });
  
      // Use forkJoin to wait for all cartItem observables to complete
      forkJoin(cartItemObservables).subscribe((cartItems: CartItem[][]) => {
        // Extract userIds from nested cartItems
        const userIds = cartItems.map(cartItem => cartItem[0]._userId);
        
        // Fetch user details for each userId
        const userObservables: Observable<any>[] = userIds.map(userId => this.userService.getUserById(userId));
        
        // Use forkJoin to wait for all user observables to complete
        forkJoin(userObservables).subscribe((users: User[][]) => {
          // Assign users to reviews
          reviews.forEach((review, index) => {
            review.username = users[index][0].name;
          });
          // Sort reviews by date
          this.reviews = reviews.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateA.getTime() - dateB.getTime();
          });
        });
      });
      
    });
    
    this.totalReviews = this.reviews.length;
    this.reviewChunks = this.chunkArray(this.reviews, 2);
  }
}
