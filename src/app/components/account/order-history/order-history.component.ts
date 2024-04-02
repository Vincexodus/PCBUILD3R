import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../../service/util.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../interface/user.model';
import { UserService } from '../../../service/user.service';
import { Order } from '../../../interface/order.model';
import { Review } from '../../../interface/review.model';
import { OrderService } from '../../../service/order.service';
import { Voucher } from '../../../interface/voucher.model';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../../interface/cart-item.model';
import { forkJoin } from 'rxjs';
import { Product } from '../../../interface/product.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.sass'
})
export class OrderHistoryComponent {
  @Input() show: boolean = false;
  userId: string = "";
  userEmail: string = "";
  users!: User[];
  orders: Order[] = [];
  cartItems: CartItem[] = [];
  products!: Product[];
  vouchers!: Voucher[];
  reviews!: Review[];
  viewModalStates: { [orderId: string]: boolean } = {};
  editReviewModalStates: { [orderId: string]: boolean } = {};
  viewForm: FormGroup;
  editReviewForm: FormGroup;
  
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private userService: UserService, 
    private orderService: OrderService, 
    private toast: NgToastService, 
    private util: UtilService,
    private formBuilder: FormBuilder) {

    this.viewForm = this.formBuilder.group({
      id: [{value: '', disabled: true}],
      userId: [{value: '', disabled: true}],
      cartItems: [{value: '', disabled: true}],
      voucherKey: [{value: '', disabled: true}],
      paymentMethod: [{value: '', disabled: true}],
      total: [{value: '', disabled: true}],
    });

    this.editReviewForm = this.formBuilder.group({
      productId: [{value: '', disabled: true}],
      rating: ['', [Validators.required, Validators.pattern('[1-5]{1}')]],
      desc: ['', [Validators.maxLength(100)]],
    });
  }

  ngOnInit() {
    this.getCurrUserId();
  }

  getCurrUserId() {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      const storedUserId = localStorage.getItem('user-id');
      if (storedUserId) {
        this.userService.getUserById(storedUserId).subscribe((user: User[]) => {
          this.userId = user[0]._id;
          this.userEmail = user[0].email;
          if (this.userId.length !== 0) {
            this.getOrders(this.userId);
          } else {
            this.router.navigate(['/login']);
          }
        });
      }
    }
  }

  maskString(input: string): string {
    return this.util.maskString(input);
  }

  getVoucherKeyById(voucherId: string | undefined): string | undefined {
    if (this.vouchers) {
      const voucher = this.vouchers.find(v => v._id === voucherId);
      return voucher?.key? voucher?.key: '-';
    }
    return '-'
  }

  getPaymentNameByType(paymentType: string | undefined): string {
    switch (paymentType) {
      case 'BT':
        return 'Bank Transfer';
      case 'DCC':
        return 'Debit/Credit Card';
      case 'COD':
        return 'Cash on Delivery';
      default:
        return '-';
    }
  }
  
  openViewModal(orderId: string) {
    this.viewModalStates[orderId] = true;
    const order = this.orders.find(order => order._id === orderId);
    this.viewForm.patchValue({
      id: order?._id,
      userId: this.userEmail,
      cartItems: order?._cartItemIds.length,
      paymentMethod: this.getPaymentNameByType(order?.paymentMethod),
      voucherKey: this.getVoucherKeyById(order?._voucherId),
      total: order?.total.$numberDecimal,
    })
  }

  closeViewModal(orderId: string) {
    this.viewModalStates[orderId] = false;
  }

  openEditReviewModal(reviewId: string) {
    this.editReviewModalStates[reviewId] = true;
    const review = this.reviews.find(r => r._id === reviewId);
    this.editReviewForm.patchValue({
      // product: review?._productId,
      rating: review?.rating,
      desc: review?.desc,
    })
  }

  closeEditReviewModal(orderId: string) {
    this.editReviewModalStates[orderId] = false;
  }

  getUsers() {
    this.userService.getUser().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  getOrders(userId: string) {
    this.orderService.getOrderByUserId(userId).subscribe((orders: Order[]) => {
      this.orders = orders;
      // Iterate through each order
      this.orders.forEach(order => {
        const orderCartItemIds = order._cartItemIds;
        // Create an array of observables for fetching cart items
        const cartItemObservables = orderCartItemIds.map(itemId =>
          this.orderService.getCartItem(itemId)
        );

        forkJoin(cartItemObservables).subscribe((cartItems: CartItem[][]) => {
          // Assign the fetched cart items to the current order object
          order.cartItems = cartItems.flat(); // Flatten the array of arrays
          console.log(order.cartItems);
        }, (error) => {
          console.log(error);
        });
      });
    }, (error) => {
      console.log(error);
    });
  }

  getVouchers() {
    this.orderService.getVoucher().subscribe((vouchers: Voucher[]) => {
      this.vouchers = vouchers;
    });
  }

  editOrderReviews(id: string) {
    if (this.editReviewForm.valid)  {
      const id = this.editReviewForm.get('id')?.value;
      const name = this.editReviewForm.get('name')?.value;
      const email = this.editReviewForm.get('email')?.value;
      const telephone = this.editReviewForm.get('telephone')?.value;
      this.userService.updateUser(id, name, email, telephone).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'User Updated!', duration:2000, position:'topCenter'});
        // this.getOrders();
        this.closeEditReviewModal(id);
      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }
}
