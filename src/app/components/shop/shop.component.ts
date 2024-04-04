import { Component, Input, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../utils/pagination/pagination.component';
import { BreadcrumbNavComponent } from '../utils/breadcrumb-nav/breadcrumb-nav.component';
import { Product } from '../../interface/product.model';
import { ProductService } from '../../service/product.service';
import { ProductCategory } from '../../interface/product-category.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, PaginationComponent, BreadcrumbNavComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.sass'
})
export class ShopComponent implements OnInit {
  @Input() filteredCategory: string = "All Products";
  isDropdownActive = false;
  products!: Product[];
  productCategory!: ProductCategory[];
  productsChunks: any[][] = [];

  constructor(private productService: ProductService) { }
  
  ngOnInit() {
    this.getProduct();
    this.getCategory();
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
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

  getProduct() {
    this.productService.getProduct().subscribe((products: Product[]) => {
      this.products = products.sort((a, b) => {
        return a.productName.localeCompare(b.productName);
      });
      this.products = this.products.slice(0, 12);
      this.productsChunks = this.chunkArray(this.products, 4);
    });
  }

  getCategory() {
    this.productService.getProductCategory().subscribe((productCategory: ProductCategory[]) => {
      this.productCategory = productCategory.sort((a, b) => {
        return a.productCategoryName.localeCompare(b.productCategoryName);
      });
    });
  }
}
