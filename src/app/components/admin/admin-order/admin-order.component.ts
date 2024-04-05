import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../../service/util.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../interface/user.model';
import { Order } from '../../../interface/order.model';
import { Review } from '../../../interface/review.model';
import { OrderService } from '../../../service/order.service';
import { Voucher } from '../../../interface/voucher.model';
import { CartItem } from '../../../interface/cart-item.model';
import { Product } from '../../../interface/product.model';
import { ProductService } from '../../../service/product.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-order.component.html',
  styleUrl: './admin-order.component.sass'
})

export class AdminOrderComponent {
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
  editModalStates: { [orderId: string]: boolean } = {};
  editReviewModalStates: { [cartItemId: string]: boolean } = {};
  deleteModalStates: { [orderId: string]: boolean } = {};
  viewForm: FormGroup;
  editReviewForm: FormGroup;
  
  constructor(
    private orderService: OrderService, 
    private productService: ProductService, 
    private toast: NgToastService, 
    private util: UtilService,
    private formBuilder: FormBuilder) {

    this.viewForm = this.formBuilder.group({
      id: [{value: '', disabled: true}],
      userId: [{value: '', disabled: true}],
      cartItems: [{value: '', disabled: true}],
      voucherKey: [{value: '', disabled: true}],
      voucherPercent: [{value: '', disabled: true}],
      paymentMethod: [{value: '', disabled: true}],
      total: [{value: '', disabled: true}],
    });

    this.editReviewForm = this.formBuilder.group({
      cartItemId: [{value: '', disabled: true}],
      rating: ['1', [Validators.required, Validators.pattern('[1-5]{1}')]],
      desc: ['', [Validators.maxLength(100)]],
    });
  }

  ngOnInit() {
    this.getOrders();
    this.getVouchers();
    this.getProducts();
    this.getReviews();
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

  maskProductName(input: string | undefined): string {
    return this.util.maskStringLong(input);
  }

  getVoucherKeyById(voucherId: string | undefined): string | undefined {
    if (this.vouchers) {
      const voucher = this.vouchers.find(v => v._id === voucherId);
      return voucher?.key? voucher?.key: '-';
    }
    return '-'
  }

  getVoucherPercentById(voucherId: string | undefined): number | undefined {
    if (this.vouchers) {
      const voucher = this.vouchers.find(v => v._id === voucherId);
      return voucher?.percent.$numberDecimal? voucher?.percent.$numberDecimal: 0;
    }
    return 0
  }

  getProductById(id: string): Product | undefined | null {
    if (this.products) {
      const product = this.products.find(p => p._id === id);
      return product;
    }
    return null;
  }

  subtotalById(id: string, quantity: number): number {
    if (this.products) {
      const product = this.products.find(p => p._id === id);
      if (product)
      return parseFloat((product?.price.$numberDecimal * quantity).toFixed(2));
    }
    return 0;
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

  isReviewExist(cartItemId: string): boolean {
    const review = this.reviews.find(r => r._cartItemId === cartItemId);
    return review? true : false;
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
      voucherPercent: this.getVoucherPercentById(order?._voucherId) + '%',
      total: order?.total.$numberDecimal,
    })
  }

  closeViewModal(orderId: string) {
    this.viewModalStates[orderId] = false;
  }

  openEditModal(orderId: string) {
    this.editModalStates[orderId] = true;
  }

  closeEditModal(orderId: string) {
    this.editModalStates[orderId] = false;
  }

  openEditReviewModal(cartItemId: string) {
    this.editReviewModalStates[cartItemId] = true;
    const review = this.reviews.find(r => r._cartItemId === cartItemId);
    this.editReviewForm.patchValue({
      cartItemId: cartItemId,
      rating: review?.rating.toString(),
      desc: review?.desc,
    })
  }

  openDeleteModal(cartItemId: string) {
    this.deleteModalStates[cartItemId] = true;
  }

  closeDeleteModal(cartItemId: string) {
    this.deleteModalStates[cartItemId] = false;
  }

  closeEditReviewModal(cartItemId: string) {
    this.editReviewModalStates[cartItemId] = false;
  }

  getVouchers() {
    this.orderService.getVoucher().subscribe((vouchers: Voucher[]) => {
      this.vouchers = vouchers;
    });
  }

  getProducts() {
    this.productService.getProduct().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  getReviews() {
    this.orderService.getReview().subscribe((reviews: Review[]) => {
      this.reviews = reviews;
    });
  }

  getOrders() {
    this.orderService.getOrder().subscribe((orders: Order[]) => {
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
          // console.log(order.cartItems);
        }, (error) => {
          console.log(error);
        });
      });
    }, (error) => {
      console.log(error);
    });
  }

  editCartItemReviews(id: string) {
    if (this.editReviewForm.valid)  {
      const rating = this.editReviewForm.get('rating')?.value;
      const desc = this.editReviewForm.get('desc')?.value;
      this.orderService.updateReview(id, rating, desc).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'Review Updated!', duration:2000, position:'topCenter'});
        this.closeEditReviewModal(id);
        this.getReviews();
      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

  deleteCartItemReview(id: string) {
    this.orderService.deleteReview(id).subscribe(() => {
      this.toast.success({detail:"SUCCESS",summary:'Cart Item Review Deleted!', duration:2000, position:'topCenter'});
      this.getReviews();
      this.closeDeleteModal(id);
    }, (error) => {
      console.log(error);
    })
  }
}
