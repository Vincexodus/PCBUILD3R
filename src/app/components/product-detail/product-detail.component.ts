import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProductCounterComponent } from '../utils/product-counter/product-counter.component';
import { ProductRatingComponent } from '../utils/product-rating/product-rating.component';
import { ProductReviewComponent } from '../product-review/product-review.component';
import { ProductSlideshowComponent } from '../product-slideshow/product-slideshow.component';
import { ProductService } from '../../service/product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from '../../interface/product.model';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { Review } from '../../interface/review.model';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../service/util.service';

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

  selectedProductId: string = "";

  constructor(private router: Router, private route: ActivatedRoute, private productService: ProductService, 
              private toast: NgToastService, private util: UtilService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
        if (params['productId']) {
          this.selectedProductId = (params['productId']);
          this.productService.getProductById((params['productId'])).subscribe((product: Product[]) => {
            this.product = product[0];
            this.getProductReviews(params['productId']);
          }, (error) => {
            this.router.navigate(['/productNotFound']);
          })
        } else {
          this.router.navigate(['/productNotFound']);
        }
      }
    )
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

  onCounterChange(value: number) {
    console.log('Counter value:', value);
    // You can use the counter value here as needed
  }

  addCartItem(productId: string) {
    const counterValue = this.counterComponent.counterValue;
    console.log(productId, " ", counterValue);
    // this.productService.createProductCategory(productCategoryName, productCategoryNameShort, categoryImage).subscribe(() => {
    //   this.toast.success({detail:"SUCCESS",summary:'Product Category Added!', duration:2000, position:'topCenter'});
    // }, (error) => {
    //   console.log(error);    
    // })
  }
}
