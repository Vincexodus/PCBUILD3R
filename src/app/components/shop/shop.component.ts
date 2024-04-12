import { Component, Input, OnInit } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { BreadcrumbNavComponent } from '../utils/breadcrumb-nav/breadcrumb-nav.component';
import { Product } from '../../interface/product.model';
import { ProductService } from '../../service/product.service';
import { ProductCategory } from '../../interface/product-category.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, BreadcrumbNavComponent, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.sass'
})
export class ShopComponent implements OnInit {
  @Input() filteredCategory: string = "All Products";
  filterOption: string = "Alphabetical";
  isDropdownActive = false;
  products!: Product[];
  allProducts!: Product[];
  productCategory!: ProductCategory[];
  productsChunks: any[][] = [];
  priceForm: FormGroup;
  page: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService, 
    private toast: NgToastService, 
    private formBuilder: FormBuilder) {
    this.priceForm = this.formBuilder.group({
      minPrice: ['', [Validators.pattern('[0-9]*'), Validators.min(0), Validators.max(10000)]],
      maxPrice: ['', [Validators.pattern('[0-9]*'), Validators.min(0), Validators.max(10000)]],
    });
  }
  
  ngOnInit() {
    this.getCategory();
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      // click from category slideshow
      this.getProduct(this.filterOption, categoryId);
    } else {
      this.getProduct(this.filterOption);
    }
  }

  productSearch(keyword: string): void {
    if (keyword.length != 0) {
      this.products = this.allProducts.filter(product =>
        product.productName.toLowerCase().includes(keyword.toLowerCase())
      );
    } else {
      this.products = this.allProducts;
    }
    this.productsChunks = this.chunkArray(this.products, 4);
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

  getEmptyCard(row: any): any[] {
    const difference = 4 - row.length;
    return new Array(Math.max(0, difference));
  }

  getProduct(condition: string, categoryRedirect?: string) {
    this.filterOption = condition;
    // navigation to shop
    if (!categoryRedirect) {
      if (condition !== 'Best Sales') {
        this.productService.getProduct().subscribe((products: Product[]) => {
          this.allProducts = products;
          switch (condition) {
            case 'Alphabetical':
              this.products = products.sort((a, b) => {
                return a.productName.localeCompare(b.productName);
              });
              break;
            case 'Newest':
              this.products = products.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              });
              break;
            case 'Price High to Low':
              this.products = products.sort((a, b) => {
                return b.price.$numberDecimal - a.price.$numberDecimal;
              });
              break;
            case 'Price Low to High':
              this.products = products.sort((a, b) => {
                return a.price.$numberDecimal - b.price.$numberDecimal;
              });
              break;
          }
          this.productsChunks = this.chunkArray(this.products, 4);
          this.isDropdownActive = false;
        });
      } else {
        this.productService.getTopSalesProduct().subscribe((products: Product[]) => {
          this.products = products.sort((a, b) => {
            return a.productName.localeCompare(b.productName);
          });
          this.productsChunks = this.chunkArray(this.products, 4);
          this.isDropdownActive = false;
        });
      }
    // navigation from homepage
    } else {
      this.productService.getProduct().subscribe((products: Product[]) => {
        this.allProducts = products;
        this.products = products.filter(product =>
          product._productCategoryId.includes(categoryRedirect)
        );
        this.productsChunks = this.chunkArray(this.products, 4);
      });
    }
  }

  getCategory() {
    this.productService.getProductCategory().subscribe((productCategory: ProductCategory[]) => {
      this.productCategory = productCategory.sort((a, b) => {
        return a.productCategoryName.localeCompare(b.productCategoryName);
      });
    });
  }

  getProductByCategory(productCategoryId: string) {
    if (this.allProducts) {
      this.products = this.allProducts.filter(product =>
        product._productCategoryId.includes(productCategoryId)
      );
      this.productsChunks = this.chunkArray(this.products, 4);
    }
  }

  resetFilter() {
    this.getProduct('Alphabetical');
    this.priceForm.reset();
  }

  filterByPrice() {
    if (this.priceForm.valid) {
      const min = this.priceForm.get('minPrice')?.value;
      const max = this.priceForm.get('maxPrice')?.value;

      this.products = this.allProducts.filter(product =>
        product.price.$numberDecimal >= parseFloat(min) && product.price.$numberDecimal <= parseFloat(max)
      );

      this.productsChunks = this.chunkArray(this.products, 4);
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }
}
