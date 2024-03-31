import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { ShoppingCartItemComponent } from './shopping-cart-item/shopping-cart-item.component';
import { ProductService } from '../../service/product.service';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../interface/product.model';
import { NgToastService } from 'ng-angular-popup';
import { OrderService } from '../../service/order.service';
import { UserService } from '../../service/user.service';
import { User } from '../../interface/user.model';
import { CartItem } from '../../interface/cart-item.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { subscribe } from 'diagnostics_channel';
import { error } from 'console';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ShoppingCartItemComponent, ProductCardComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.sass'
})

export class ShoppingCartComponent implements OnInit {
  @Input() show: boolean = false;
  loading = false;
  userId: string = "";
  voucherKey: string = "";
  cartItems!: CartItem[];
  cartProducts: Product[] = [];
  deliverFee: number = 15;
  subtotal: number = 0;
  total: number = 0;
  selectedOption: string = 'BT';

  constructor(private router: Router, private productService: ProductService, 
    private toast: NgToastService, private orderService: OrderService,
    @Inject(DOCUMENT) private document: Document, private userService: UserService) { }

  ngOnInit() {
    this.getCurrUserId();
    this.orderService.cartChange$.subscribe(() => {
      this.getCurrUserId();
    });
  }

  getCurrUserId() {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      const storedUserId = localStorage.getItem('user-id');
      if (storedUserId) {
        this.userService.getUserById(storedUserId).subscribe((user: User[]) => {
          this.userId = user[0]._id;
          if (this.userId.length !== 0) {
            this.getCartItem();
          } else {
            this.router.navigate(['/login']);
          }
        });
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  getCartSummary(products: Product[]) {
    this.subtotal = 0;
    for (let i = 0; i < products.length; i++) {
      this.subtotal += this.cartProducts[i].price.$numberDecimal * this.cartItems[i].quantity;
    }
    this.subtotal = parseFloat((this.subtotal).toFixed(2));
    this.total = parseFloat((this.subtotal - this.deliverFee).toFixed(2));
  }

  getCartItem() {
    if (this.userId.length !== 0) {
      this.orderService.getCartItem(this.userId).subscribe((cartItems: CartItem[]) => {
        this.cartItems = cartItems;
        const productObservables = this.cartItems.map(item =>
          this.productService.getProductById(item._productId)
        );
  
        forkJoin(productObservables).subscribe(
          (products: Product[][]) => {
            // Flatten the array of arrays into a single array of products
            this.cartProducts = products.flat();
            this.getCartSummary(this.cartProducts);
          },
          (error) => {
            console.log(error);
          }
        );
      }, (error) => {
        console.log(error);
      })
    }
  }

  // verifyBillingDetail(userId: string): boolean {
  //   this.userService.
  // }

  checkoutCart() {
    if (this.selectedOption === "DCC") {
      // check for user billing details
    } else {
      this.loading = true;
      this.orderService.checkoutCart(this.userId, this.userId, this.voucherKey, this.selectedOption, this.total).subscribe(() => {
        this.loading = false;
        this.toast.success({detail:"SUCCESS",summary:'Checkout Successfully!', duration:2000, position:'topCenter'});
      }, (error) => {
        this.loading = false;
        console.log(error);
      }) 
    }
  }
}