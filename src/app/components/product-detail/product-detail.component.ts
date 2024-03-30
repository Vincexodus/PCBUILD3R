import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ProductCounterComponent } from '../utils/product-counter/product-counter.component';
import { ProductRatingComponent } from '../utils/product-rating/product-rating.component';
import { ProductReviewComponent } from '../product-review/product-review.component';
import { ProductSlideshowComponent } from '../product-slideshow/product-slideshow.component';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from '../../interface/product.model';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Review } from '../../interface/review.model';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../service/util.service';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';
import { User } from '../../interface/user.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ProductRatingComponent, ProductCounterComponent, ProductReviewComponent, ProductSlideshowComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.sass'
})

export class ProductDetailComponent implements OnInit {
  loading = false;
  product!: Product;
  reviews!: Review[];
  productRating: number = 0;
  productReviewNum: number = 0;
  stockQuantity: number = 0;

  @ViewChild('counterComponent') counterComponent: any;

  userId: string = "";
  selectedProductId: string = "";

  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService, 
              private toast: NgToastService, private orderService: OrderService, private util: UtilService,
              @Inject(DOCUMENT) private document: Document, private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
        if (params['productId']) {
          this.selectedProductId = (params['productId']);
          this.productService.getProductById((params['productId'])).subscribe((product: Product[]) => {
            this.product = product[0];
            this.getProductReviews(params['productId']);
            this.getCurrUserId();
          }, (error) => {
            this.router.navigate(['/productNotFound']);
          })
        } else {
          this.router.navigate(['/productNotFound']);
        }
      }
    )
  }

  getCurrUserId() {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      const storedUserId = localStorage.getItem('user-id');
      if (storedUserId) {
        this.userService.getUserById(storedUserId).subscribe((user: User[]) => {
          this.userId = user[0]._id;
        });
      }
    }
  }

  getProductReviews(productId: string) {
    this.productService.getProductReview(productId).subscribe((reviews: Review[]) => {
      this.reviews = reviews;
      this.productReviewNum = reviews.length;
      if (this.productReviewNum > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        this.productRating = Math.round(totalRating / this.productReviewNum * 10) / 10;
      }
    })
  }

  addItemToCart(productId: string) {
    const counterValue = this.counterComponent.counterValue;
    if (this.userId.length === 0) {
      this.router.navigate(['/login']);
    } else {
      this.loading = true;
      this.orderService.createCartItem(this.userId, productId, counterValue).subscribe(() => {
        this.loading = false;
        this.counterComponent.counterValue = 1;
        this.toast.success({detail:"SUCCESS",summary:'Product Added to Cart!', duration:2000, position:'topCenter'});
      }, (error) => {
        this.loading = false;
        console.log(error);
      })
    }
  }
}
