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
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UserDetail } from '../../interface/user-detail.model';
import { Voucher } from '../../interface/voucher.model';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ShoppingCartItemComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.sass'
})

export class ShoppingCartComponent implements OnInit {
  @Input() show: boolean = false;
  isCheckoutModalActive: boolean = false;
  loading = false;
  voucherBtnDisplay = false;
  userId: string = "";
  voucherInputValue: string = "";
  voucherId: string = "";
  cartItems!: CartItem[];
  vouchers!: Voucher[];
  appliedVoucher: Voucher | null = null;
  cartProducts: Product[] = [];
  deliverFee: number = 15;
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  selectedOption: string = 'BT';

  constructor(private router: Router, private productService: ProductService, 
    private toast: NgToastService, private orderService: OrderService,
    @Inject(DOCUMENT) private document: Document, private userService: UserService) { }

  ngOnInit() {
    this.getCurrUserId();
    // this.orderService.cartChange$.subscribe(() => {
    //   this.getCurrUserId();
    // });
  }

  openCheckoutModal(): void {
    this.isCheckoutModalActive = true;
  }

  closeCheckoutModal(): void {
    this.isCheckoutModalActive = false;
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

    if (this.appliedVoucher && this.appliedVoucher.percent.$numberDecimal > 0) {
      this.discount = parseFloat((this.subtotal * this.appliedVoucher.percent.$numberDecimal / 100).toFixed(2));
    }

    this.total = parseFloat((this.subtotal + this.deliverFee - this.discount).toFixed(2));
  }

  getCartItem() {
    if (this.userId.length !== 0) {
      this.orderService.getUnpaidCartItem(this.userId).subscribe((cartItems: CartItem[]) => {
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

  removeVoucher() {
    this.toast.success({detail:"SUCCESSFUL",summary:'Voucher Key Removed!', duration:2000, position:'topCenter'});
    this.voucherBtnDisplay = false;
    this.appliedVoucher  = null;
    this.discount = 0;
    this.vouchers = [];
    this.voucherInputValue = '';
    this.getCartSummary(this.cartProducts);
  }

  applyVoucher(voucherKey: string) {
    if (voucherKey.length > 0) {
      this.loading = true;
      this.orderService.getVoucherByKey(voucherKey).subscribe((vouchers: Voucher[]) => {
        this.loading = false;
        this.vouchers = vouchers;
        if (this.vouchers.length > 0) {
          this.appliedVoucher = this.vouchers[0];
          this.voucherBtnDisplay = true;
          this.getCartSummary(this.cartProducts);
          this.toast.success({detail:"SUCCESSFUL",summary:'Voucher Key Applied!', duration:2000, position:'topCenter'});
        } else {
          this.toast.error({detail:"FAILED",summary:'Invalid Voucher Key!', duration:2000, position:'topCenter'});
        }
      });
    } else {
      this.toast.error({detail:"FAILED",summary:'Empty Voucher Key!', duration:2000, position:'topCenter'});
    }
  } 

  checkoutCart() {
    this.isCheckoutModalActive = false;
    // check for payment type
    if (this.selectedOption === "DCC") {
      this.userService.getUserDetailById(this.userId).subscribe((userDetail: UserDetail[]) => {
        if (userDetail.length === 0 || 
          ((userDetail.length === 1 && (userDetail[0].cardNumber.length === 0 || userDetail[0].CVC.length === 0 
            || userDetail[0].expireMonth.length === 0 || userDetail[0].expireYear.length === 0)))) {
          this.toast.error({detail:"FAILED",summary:'Billing Information Required!', duration:2000, position:'topCenter'});
          setTimeout(() => {
            this.router.navigate(['/account', 'editProfile']);
          }, 2000);
        }
      })
    } else {
      const cartItemIds: string[] = this.cartItems.map(item => item._id);
      this.loading = true;
      if (this.appliedVoucher) this.voucherId = this.appliedVoucher._id;
      this.orderService.checkoutCart(this.userId, cartItemIds, this.voucherId, this.selectedOption, this.total).subscribe(() => {
        this.orderService.emitCartCheckout(true);
        this.toast.success({detail:"SUCCESS",summary:'Checkout Successfully!', duration:2000, position:'topCenter'});
        this.loading = false;
        setTimeout(() => { 
          this.router.navigate(['/account', 'orderHistory']);
        }, 2000);
      }, (error) => {
        this.loading = false;
        console.log(error);
      });
    }
  }
}