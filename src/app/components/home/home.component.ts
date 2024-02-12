import { Component } from '@angular/core';
import { ProductSlideshowComponent } from '../product-slideshow/product-slideshow.component';
import { IntroCardComponent } from '../intro-card/intro-card.component';
import { CategorySlideshowComponent } from '../category-slideshow/category-slideshow.component';
import { BenefitsComponent } from '../benefits/benefits.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IntroCardComponent, ProductSlideshowComponent, CategorySlideshowComponent, BenefitsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent {

}
