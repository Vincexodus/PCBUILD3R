import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../utils/pagination/pagination.component';
import { BreadcrumbNavComponent } from '../breadcrumb-nav/breadcrumb-nav.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, PaginationComponent, BreadcrumbNavComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.sass'
})
export class ShopComponent {
  @Input() filteredCategory: string = "Graphic Card";
  productCategory: string[] = ["Processor", "Motherboard", "RAM", "Power Supply", "Liquid Cooler"];

  isDropdownActive = false;

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }
}
