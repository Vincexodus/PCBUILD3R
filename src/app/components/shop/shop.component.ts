import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.sass'
})
export class ShopComponent {
  @Input() filteredCategory: string = "Graphic Card";
  productCategory: string[] = ["Processor", "Motherboard", "RAM", "Power Supply", "Liquid Cooler"];
}
