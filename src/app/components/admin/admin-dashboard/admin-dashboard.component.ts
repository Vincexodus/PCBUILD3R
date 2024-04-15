import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../interface/user.model';
import { UserService } from '../../../service/user.service';
import { ProductService } from '../../../service/product.service';
import { OrderService } from '../../../service/order.service';
import { Product } from '../../../interface/product.model';
import { Order } from '../../../interface/order.model';
import { ProductCategory } from '../../../interface/product-category.model';
import { Review } from '../../../interface/review.model';
import { Session } from 'inspector';
import { Voucher } from '../../../interface/voucher.model';
import { AuthService } from '../../../service/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.sass'
})

export class AdminDashboardComponent implements OnInit{
  @Input() show: boolean = false;
  orders!: Order[];
  totalProductCategory: number = 0;
  totalProducts: number = 0;
  totalUsers: number = 0;
  totalOrders: number = 0;
  totalVouchers: number = 0;
  totalReviews: number = 0;
  totalSales: number = 0;
  totalSessions: number = 0;

  coreStats = [
    { title: 'Total Product Category', number: this.totalProductCategory },
    { title: 'Total Products', number: this.totalProducts },
    { title: 'Total Orders', number: this.totalOrders },
    { title: 'Total Sales', number:  'MYR ' + this.totalSales },
    { title: 'Total Reviews', number: this.totalReviews },
  ];
  
  additionalStats = [
    { title: 'Total Users', number: this.totalUsers },
    { title: 'Total Vouchers', number: this.totalVouchers },
    { title: 'Total Sessions', number: this.totalSessions },
  ];
  
  adminPermissions = [
    { title: 'Product Category', view: true, create: true, edit: true, delete: true },
    { title: 'Product', view: true, create: true, edit: true, delete: true },
    { title: 'Voucher', view: true, create: true, edit: true, delete: true },
    { title: 'Orders', view: true, create: false, edit: false, delete: false },
    { title: 'Reviews', view: true, create: true, edit: true, delete: true },
    { title: 'Simulation Session', view: true, create: false, edit: false, delete: true },
    { title: 'Users', view: true, create: true, edit: true, delete: true },
  ];

  constructor(
    private authService: AuthService, 
    private productService: ProductService, 
    private userService: UserService,
    private orderService: OrderService) { }

  ngOnInit() {
    const storedUserId = this.authService.getUserId();
    if (storedUserId) {
      this.fetchData();
    }
  }

  fetchData() {
    const productCategory$ = this.productService.getProductCategory();
    const product$ = this.productService.getProduct();
    const user$ = this.userService.getUser();
    const order$ = this.orderService.getOrder();
    const voucher$ = this.orderService.getVoucher();
    const review$ = this.orderService.getReview();
    const session$ = this.userService.getSession();
  
    forkJoin([productCategory$, product$, user$, order$, voucher$, review$, session$]).subscribe(
      ([productCategory, product, user, order, voucher, review, session]) => {
        this.totalProductCategory = productCategory.length;
        this.totalProducts = product.length;
        this.totalUsers = user.length;
        this.totalOrders = order.length;
        this.totalVouchers = voucher.length;
        this.totalReviews = review.length;
        this.totalSessions = session.length;
  
        // Calculate total sales
        if (order.length !== 0) {
          this.orders = order;
          for (let i = 0; i < this.orders.length; i++) {
            this.totalSales += parseFloat(this.orders[i].total.$numberDecimal.toString());
          }
          this.totalSales = parseFloat((this.totalSales).toFixed(2));
        }
  
        // Update statistics
        this.updateStats();
      },
      error => {
        // Handle error
        console.error('Error fetching data:', error);
      }
    );
  }

  updateStats() {
    this.coreStats = [
      { title: 'Total Product Category', number: this.totalProductCategory },
      { title: 'Total Products', number: this.totalProducts },
      { title: 'Total Orders', number: this.totalOrders },
      { title: 'Total Sales', number:  'MYR ' + this.totalSales },
      { title: 'Total Reviews', number: this.totalReviews },
    ];
    this.additionalStats = [
      { title: 'Total Users', number: this.totalUsers },
      { title: 'Total Vouchers', number: this.totalVouchers },
      { title: 'Total Sessions', number: this.totalSessions },
    ];
  }
}
