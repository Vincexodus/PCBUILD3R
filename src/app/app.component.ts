import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductSlideshowComponent } from './components/product-slideshow/product-slideshow.component';
import { IntroCardComponent } from './components/intro-card/intro-card.component';
import { CategorySlideshowComponent } from './components/category-slideshow/category-slideshow.component';
import { BenefitsComponent } from './components/benefits/benefits.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, 
            ProductSlideshowComponent, IntroCardComponent, CategorySlideshowComponent, BenefitsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'PCBuild3R';
}
