import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { DividerComponent } from '../utils/divider/divider.component';

@Component({
  selector: 'app-category-slideshow',
  standalone: true,
  imports: [ProductCardComponent, DividerComponent],
  templateUrl: './category-slideshow.component.html',
  styleUrl: './category-slideshow.component.sass'
})
export class CategorySlideshowComponent {
  @Input() title: string = "";
}
