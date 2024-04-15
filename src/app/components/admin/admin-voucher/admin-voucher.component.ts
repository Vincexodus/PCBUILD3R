import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OrderService } from '../../../service/order.service';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../../service/util.service';
import { Voucher } from '../../../interface/voucher.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-admin-voucher',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './admin-voucher.component.html',
  styleUrl: './admin-voucher.component.sass'
})

export class AdminVoucherComponent {
  @Input() show: boolean = false;
  vouchers!: Voucher[];
  isAddModalActive: boolean = false;
  deleteModalStates: { [voucherId: string]: boolean } = {};
  editModalStates: { [voucherId: string]: boolean } = {};
  addForm: FormGroup;
  editForm: FormGroup;
  page: number = 1;

  constructor(
    private authService: AuthService, 
    private orderService: OrderService, 
    private toast: NgToastService, 
    private util: UtilService,
    private formBuilder: FormBuilder) {
      this.addForm = this.formBuilder.group({
        percent: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.min(5), Validators.max(95)]],
        active: ['true']
      });

      this.editForm = this.formBuilder.group({
        id: [{value: '', disabled: true}],
        key: [{value: '', disabled: true}],
        percent: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.min(5), Validators.max(95)]],
        active: ['true']
      });
    }
  
  ngOnInit() {
    const storedUserId = this.authService.getUserId();
    if (storedUserId) {
      this.getVoucher();
    }
  }

  voucherSearch(keyword: string): void {
    if (keyword.length != 0) {
      this.vouchers = this.vouchers.filter(v =>
        v.key.toLowerCase().includes(keyword.toLowerCase())
      );
    } else {
      this.getVoucher();
    }
  }

  maskString(input: string): string {
    return this.util.maskString(input);
  }

  openAddModal(): void {
    this.isAddModalActive = true;
  }

  closeAddModal(): void {
    this.isAddModalActive = false;
  }

  openDeleteModal(voucherId: string) {
    this.deleteModalStates[voucherId] = true;
  }

  closeDeleteModal(voucherId: string) {
    this.deleteModalStates[voucherId] = false;
  }
  
  openEditModal(voucherId: string) {
    this.editModalStates[voucherId] = true;
    const voucher = this.vouchers.find(v => v._id === voucherId);
    this.editForm.patchValue({
      id: voucher?._id,
      key: voucher?.key,
      percent: voucher?.percent.$numberDecimal,
      active: voucher?.active.toString(),
    })
  }

  closeEditModal(voucherId: string) {
    this.editModalStates[voucherId] = false;
  }

  getVoucher() {
    this.orderService.getVoucher().subscribe((voucher: Voucher[]) => {
      this.vouchers = voucher.sort((a, b) => {
        return a.key.localeCompare(b.key);
      });
    });
  }

  addVoucher() {
    if (this.addForm.valid) {
      const percent = this.addForm.get('percent')?.value;
      const active = this.addForm.value.active;
      this.orderService.createVoucher(percent, active).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'Voucher Added!', duration:2000, position:'topCenter'});
        this.getVoucher();
        this.closeAddModal();
        this.addForm.patchValue({ percent: ''});
      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

  editVoucher(id: string) {
    if (this.editForm.valid) {
      const percent = this.editForm.get('percent')?.value;
      const active = this.editForm.value.active;
      this.orderService.updateVoucher(id, percent, active).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'Voucher Updated!', duration:2000, position:'topCenter'});
        this.getVoucher();
        this.closeEditModal(id);
        this.editForm.patchValue({ percent: ''});
      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

  deleteVoucher(id: string) {
    this.orderService.deleteVoucher(id).subscribe(() => {
      this.toast.error({detail:"SUCCESS",summary:'Voucher Deleted!', duration:2000, position:'topCenter'});
      this.getVoucher();
      this.closeDeleteModal(id);
    }, (error) => {
      console.log(error);
    })
  }
}
