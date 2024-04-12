import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProductCardComponent } from '../../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { ProductCategory } from '../../../interface/product-category.model';
import { ProductService } from '../../../service/product.service';
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-slideshow',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, SlickCarouselModule],
  templateUrl: './category-slideshow.component.html',
  styleUrl: './category-slideshow.component.sass'
})
export class CategorySlideshowComponent implements OnInit {
  @Input() title: string = "";
  @ViewChild('slickModal')
  slickModal!: SlickCarouselComponent;
  productCategory!: ProductCategory[];
  slideConfig = { slidesToShow: 5, slidesToScroll: 5, arrows: false };
  
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getCategory();
  }

  getCategory() {
    this.productService.getProductCategory().subscribe((productCategory: ProductCategory[]) => {
      this.productCategory = productCategory.sort((a, b) => {
        return a.productCategoryName.localeCompare(b.productCategoryName);
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
