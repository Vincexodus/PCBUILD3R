import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { DividerComponent } from '../utils/divider/divider.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { ProductCategory } from '../../interface/product-category.model';
import { Product } from '../../interface/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-slideshow',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, DividerComponent, SlickCarouselModule],
  templateUrl: './product-slideshow.component.html',
  styleUrl: './product-slideshow.component.sass'
})
export class ProductSlideshowComponent implements OnInit {
  @Input() title: string = "";
  @Input() showDivider: boolean = true;
  @ViewChild('slickModal')
  slickModal!: SlickCarouselComponent;
  products!: Product[];
  slideConfig = { slidesToShow: 4, slidesToScroll: 4, arrows: false };
  
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getLatestProduct();
  }

  getLatestProduct() {
    this.productService.getLatestProduct().subscribe((products: Product[]) => {
      this.products = products.sort((a, b) => {
        return a.productName.localeCompare(b.productName);
      });
    });
  }

  next() {
    this.slickModal.slickNext();
  }
  
  prev() {
    this.slickModal.slickPrev();
  }
}
