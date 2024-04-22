import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, SlickCarouselModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.sass'
})
export class AboutComponent {
  @Input() show: boolean = false;

  featuresSlides = [
    { directory: 'signup.png', description: 'Sign Up/Login' },
    { directory: 'homepage.png', description: 'Homepage' },
    { directory: 'slideshow.png', description: 'Product Slideshow' },
    { directory: 'admin_dashboard.png', description: 'Admin Dashboard' },
    { directory: 'manage_inventory.png', description: 'Inventory Management for Admin' },
    { directory: 'intro_simulation.png', description: 'Introduction to Simulation' },
    { directory: 'simulation.png', description: 'Virtual PC Building Simulation' },
    { directory: 'shop.png', description: 'Hardware Product Browsing' },
    { directory: 'product_detail.png', description: 'Hardware Product Details' },
    { directory: 'shopping_cart.png', description: 'Manage Shopping Cart' },
    { directory: 'view_order.png', description: 'View Order History' },
    { directory: 'edit_profile.png', description: 'Edit Profile' },
    { directory: 'help.png', description: 'Help Section' },
    { directory: 'contact.png', description: 'Contact Page' },
  ]

  slideConfig = { slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 6000, infinite: true, arrows: false, dots: true };

}
