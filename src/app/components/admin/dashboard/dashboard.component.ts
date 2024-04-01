import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../interface/user.model';
import { UserService } from '../../../service/user.service';
import { ProductService } from '../../../service/product.service';
import { OrderService } from '../../../service/order.service';
import { Product } from '../../../interface/product.model';
import { Order } from '../../../interface/order.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent implements OnInit{
  @Input() show: boolean = false;
  orders!: Order[];
  totalProducts: number = 0;
  totalUsers: number = 0;
  totalOrders: number = 0;
  totalSales: number = 0;

  constructor(private productService: ProductService, private userService: UserService, private orderService: OrderService) { }

  ngOnInit() {
    this.productService.getProduct().subscribe((user: User[]) => {
      this.totalProducts = user.length;
    });
    this.userService.getUser().subscribe((product: Product[]) => {
      this.totalUsers = product.length;
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
  }
}
