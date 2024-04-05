import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink, OrderHistoryComponent, ShoppingCartComponent,
            EditProfileComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent {
  
  directories = [
    { name: "Order History", icon: "fa-regular fa-clipboard", link: 'orderHistory' },
    { name: "Shopping Cart", icon: "fa-solid fa-cart-shopping", link: 'shoppingCart' },
    { name: "Edit Profile", icon: "fa-solid fa-pen-to-square", link: 'editProfile' },
  ]
  
  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  isActiveTab(tab: string): boolean {
    return this.route.snapshot.firstChild?.routeConfig?.path === tab;
  }
  
  logout() {
    this.authService.logout();
  }
}
