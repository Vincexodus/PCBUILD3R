import { Component } from '@angular/core';
import { Directory } from '../../../interfaces/directory';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AdminProductComponent } from '../admin-product/admin-product.component';
import { AdminPaymentComponent } from '../admin-payment/admin-payment.component';
import { AdminUserComponent } from '../admin-user/admin-user.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink, DashboardComponent, AdminProductComponent, AdminPaymentComponent,
            AdminUserComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.sass'
})
export class AdminHomeComponent {
  directories: Directory[] = [
    { name: "Dashboard", icon: "fa-solid fa-chart-line", link: 'dashboard' },
    { name: "Products", icon: "fa-solid fa-box-archive", link: 'adminProduct' },
    { name: "Payments", icon: "fa-solid fa-credit-card", link: 'adminPayment' },
    { name: "User", icon: "fa-solid fa-circle-user", link: 'adminUser' },
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
