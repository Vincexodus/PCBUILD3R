import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminProductComponent } from '../admin-product/admin-product.component';
import { AdminUserComponent } from '../admin-user/admin-user.component';
import { AdminCategoryComponent } from '../admin-category/admin-category.component';
import { AuthService } from '../../../service/auth.service';
import { UserService } from '../../../service/user.service';
import { User } from '../../../interface/user.model';
import { AdminOrderComponent } from '../admin-order/admin-order.component';
import { AdminVoucherComponent } from '../admin-voucher/admin-voucher.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { AdminSessionComponent } from '../admin-session/admin-session.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminDashboardComponent, AdminProductComponent, AdminCategoryComponent,
            AdminOrderComponent, AdminUserComponent, AdminVoucherComponent, AdminSessionComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.sass'
})

export class AdminHomeComponent implements OnInit {
  userEmail: string = "";
  currYear: number = new Date().getFullYear();
  directories = [
    { name: "Dashboard", icon: "fa-solid fa-chart-line", link: 'dashboard' },
    { name: "Categories", icon: "fa-solid fa-list", link: 'category' },
    { name: "Products", icon: "fa-solid fa-box-archive", link: 'product' },
    { name: "Vouchers", icon: "fa-solid fa-ticket", link: 'voucher' },
    { name: "Orders & Reviews", icon: "fa-solid fa-clipboard", link: 'order' },
    { name: "Simulation Sessions", icon: "fa-solid fa-cube", link: 'session' },
    { name: "Users", icon: "fa-solid fa-circle-user", link: 'user' },
  ]

  constructor(private route: ActivatedRoute, private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    const storedUserId = this.authService.getUserId();
    if (storedUserId) {
      this.userService.getUserById(storedUserId).subscribe((user: User[]) => {
        this.userEmail = user[0].email;
      });
    }
  }

  isActiveTab(tab: string): boolean {
    return this.route.snapshot.firstChild?.routeConfig?.path === tab;
  }

  currTitle: string = this.directories[0].name;
  updateTitle(name: string): void {
    this.currTitle = name;
  }

  logout() {
    this.authService.logout();
  }
}
