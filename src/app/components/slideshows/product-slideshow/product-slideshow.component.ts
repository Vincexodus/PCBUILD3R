import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProductCardComponent } from '../../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../service/product.service';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { Product } from '../../../interface/product.model';
import { RouterLink } from '@angular/router';
import { Review } from '../../../interface/review.model';

@Component({
  selector: 'app-product-slideshow',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, SlickCarouselModule],
  templateUrl: './product-slideshow.component.html',
  styleUrl: './product-slideshow.component.sass'
})
export class ProductSlideshowComponent implements OnInit {
  @Input() title: string = "";
  @Input() selectedProductId: string = "";
  @Input() cutWidth: boolean = true;
  @Input() showDivider: boolean = true;
  @ViewChild('slickModal')
  slickModal!: SlickCarouselComponent;
  products!: Product[];
  reviews!: Review[];
  slideConfig = { slidesToShow: 4, slidesToScroll: 4, autoplay: true, autoplaySpeed: 6000, infinite: true, arrows: false };
  
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getTitleProduct();
  }

  getTitleProduct() {
    if (this.title === "NEW ARRIVALS") {
      this.productService.getLatestProduct().subscribe((products: Product[]) => {
        this.products = products.sort((a, b) => {
          return a.productName.localeCompare(b.productName);
        });
      });
    } else if (this.title === "TOP SELLING") {
      this.showDivider = false;
      this.productService.getTopProduct().subscribe((products: Product[]) => {
        this.products = products.sort((a, b) => {
          return a.productName.localeCompare(b.productName);
        });
      });
    } else if (this.title === "YOU MAY ALSO LIKE") {
      this.showDivider = false;
      this.productService.getCommonProduct(this.selectedProductId).subscribe((products: Product[]) => {
        this.products = products.sort((a, b) => {
          return a.productName.localeCompare(b.productName);
        });
      });
    } 
  }
  
  next() {
    this.slickModal.slickNext();
  }
  
  prev() {
    this.slickModal.slickPrev();
  }
}
