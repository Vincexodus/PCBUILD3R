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
    { title: 'Users', view: true, create: true, edit: true, delete: true },
  ];

  constructor(
    private productService: ProductService, 
    private userService: UserService, 
    private orderService: OrderService) { }

    ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.productService.getProductCategory().subscribe((productCategory: ProductCategory[]) => {
      this.totalProductCategory = productCategory.length;
    });

    this.productService.getProduct().subscribe((product: Product[]) => {
      this.totalProducts = product.length;
    });

    this.userService.getUser().subscribe((user: User[]) => {
      this.totalUsers = user.length;
    });

    this.orderService.getOrder().subscribe((order: Order[]) => {
      this.totalOrders = order.length;
      if (this.totalOrders !== 0) {
        this.orders = order;
        for (let i = 0; i < this.orders.length; i++) {
          this.totalSales += this.orders[i].total.$numberDecimal * 1;
        }
        this.totalSales = parseFloat((this.totalSales).toFixed(2));
      }
    });

    this.orderService.getVoucher().subscribe((voucher: Voucher[]) => {
      this.totalVouchers = voucher.length;
    });

    this.orderService.getReview().subscribe((review: Review[]) => {
      this.totalReviews = review.length;
    });

    this.userService.getSession().subscribe((session: Session[]) => {
      this.totalSessions = session.length;
    });

    this.updateStats();
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
