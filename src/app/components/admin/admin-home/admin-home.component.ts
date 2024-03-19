import { Component } from '@angular/core';
import { Directory } from '../../../interface/directory';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AdminProductComponent } from '../admin-product/admin-product.component';
import { AdminPaymentComponent } from '../admin-payment/admin-payment.component';
import { AdminUserComponent } from '../admin-user/admin-user.component';
import { AdminCategoryComponent } from '../admin-category/admin-category.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardComponent, AdminProductComponent, AdminCategoryComponent,
            AdminPaymentComponent, AdminUserComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.sass'
})
export class AdminHomeComponent {
  directories: Directory[] = [
    { name: "Dashboard", icon: "fa-solid fa-chart-line", link: 'dashboard' },
    { name: "Products", icon: "fa-solid fa-box-archive", link: 'product' },
    { name: "Category", icon: "fa-solid fa-list", link: 'category' },
    { name: "Payments", icon: "fa-solid fa-credit-card", link: 'payment' },
    { name: "User", icon: "fa-solid fa-circle-user", link: 'user' },
  ]

  constructor(private route: ActivatedRoute) {}

  isActiveTab(tab: string): boolean {
    return this.route.snapshot.firstChild?.routeConfig?.path === tab;
  }

  currTitle: string = this.directories[0].name;
  updateTitle(name: string): void {
    this.currTitle = name;
  }
}
