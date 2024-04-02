import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../../service/util.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../interface/user.model';
import { UserService } from '../../../service/user.service';
import { Order } from '../../../interface/order.model';
import { Review } from '../../../interface/review.model';
import { OrderService } from '../../../service/order.service';
import { Voucher } from '../../../interface/voucher.model';

@Component({
  selector: 'app-admin-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-order.component.html',
  styleUrl: './admin-order.component.sass'
})

export class AdminOrderComponent {
  @Input() show: boolean = false;
  users!: User[];
  orders!: Order[];
  vouchers!: Voucher[];
  reviews!: Review[];
  viewModalStates: { [orderId: string]: boolean } = {};
  editReviewModalStates: { [orderId: string]: boolean } = {};
  viewForm: FormGroup;
  editReviewForm: FormGroup;
  
  constructor(
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
    this.getUsers();
    this.getOrders();
    this.getVouchers();
    this.getOrderReviews();
  }

  orderSearch(keyword: string): void {
    if (keyword.length != 0) {
      this.orders = this.orders.filter(order =>
        order._id.toLowerCase().includes(keyword.toLowerCase())
      );
    } else {
      this.getOrders();
    }
  }

  maskString(input: string): string {
    return this.util.maskString(input);
  }

  getUserEmailById(userId: string | undefined): string | undefined {
    const user = this.users.find(user => user._id === userId);
    return user?.email;
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
      userId: this.getUserEmailById(order?._userId),
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

  getOrders() {
    this.orderService.getOrder().subscribe((orders: Order[]) => {
      this.orders = orders;
    });
  }

  getVouchers() {
    this.orderService.getVoucher().subscribe((vouchers: Voucher[]) => {
      this.vouchers = vouchers;
    });
  }

  getOrderReviews() {
    this.userService.getUserDetail().subscribe((reviews: Review[]) => {
      this.reviews = reviews;
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
        this.getOrders();
        this.closeEditReviewModal(id);
      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }
}
