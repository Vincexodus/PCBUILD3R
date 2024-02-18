import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { DividerComponent } from '../utils/divider/divider.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-slideshow',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, DividerComponent],
  templateUrl: './product-slideshow.component.html',
  styleUrl: './product-slideshow.component.sass'
})
export class ProductSlideshowComponent {
  @Input() title: string = "";
  @Input() showDivider: boolean = true;
}
