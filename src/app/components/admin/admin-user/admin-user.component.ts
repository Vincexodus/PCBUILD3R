import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../../service/util.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../interface/user.model';
import { UserService } from '../../../service/user.service';
import { WebRequestService } from '../../../service/web-request.service';
import { UserDetail } from '../../../interface/user-detail.model';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.sass'
})

export class AdminUserComponent {
  @Input() show: boolean = false;
  users!: User[];
  userDetails!: UserDetail[];
  isAddModalActive: boolean = false;
  deleteModalStates: { [userId: string]: boolean } = {};
  editModalStates: { [userId: string]: boolean } = {};
  editBillingModalStates: { [userId: string]: boolean } = {};
  addForm: FormGroup;
  editForm: FormGroup;
  editBillingForm: FormGroup;

  constructor(
    private webService: WebRequestService, 
    private userService: UserService, 
    private toast: NgToastService, 
    private util: UtilService,
    private formBuilder: FormBuilder) {

      this.addForm = this.formBuilder.group({
        isAdmin: ['false', [Validators.required]],
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
        telephone: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]],
      });

      this.editForm = this.formBuilder.group({
        id: [{value: '', disabled: true}],
        isAdmin: [{value: '', disabled: true}],
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]],
      });

      this.editBillingForm = this.formBuilder.group({
        id: [{value: '', disabled: true}],
        address: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(60)]],
        city: ['', [Validators.required, Validators.required]],
        postalCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
        country: ['', [Validators.required, Validators.required]],
        cardNumber: ['', [Validators.pattern('[0-9]{16}')]],
        CVC: ['', [Validators.pattern('[0-9]{3}')]],
        expireMonth: ['', [Validators.pattern('[0-9]*'), Validators.min(1), Validators.max(12)]],
        expireYear: ['', [Validators.pattern('[0-9]*'), Validators.min(2024)]],
      });
    }

  ngOnInit() {
    this.getUsers();
    this.getUserDetails();
  }

  userSearch(keyword: string): void {
    if (keyword.length != 0) {
      this.users = this.users.filter(user =>
        user.name.toLowerCase().includes(keyword.toLowerCase())
      );
    } else {
      this.getUsers();
    }
  }
  
  maskString(input: string): string {
    return this.util.maskString(input);
  }

  openAddModal(): void {
    this.isAddModalActive = true;
    this.addForm.reset();
  }

  closeAddModal(): void {
    this.isAddModalActive = false;
  }

  openDeleteModal(userId: string) {
    this.deleteModalStates[userId] = true;
  }

  closeDeleteModal(userId: string) {
    this.deleteModalStates[userId] = false;
  }
  
  openEditModal(userId: string) {
    this.editModalStates[userId] = true;
    const user = this.users.find(user => user._id === userId);
    this.editForm.patchValue({
      id: user?._id,
      isAdmin: user?.isAdmin? "Admin":" Customer",
      name: user?.name,
      email: user?.email,
      telephone: user?.telephone,
    })
  }

  closeEditModal(userId: string) {
    this.editModalStates[userId] = false;
  }
  
  openEditBillingModal(userId: string) {
    this.editBillingModalStates[userId] = true;
    const user = this.users.find(u => u._id === userId);
    // userDetail missing if user never update billing
    const userDetail = this.userDetails.find(userD => userD._userId === user?._id);
    this.editBillingForm.patchValue({
      id: user?._id,
      address: userDetail?.address,
      city: userDetail?.city,
      postalCode: userDetail?.postalCode,
      country: userDetail?.country,
      cardNumber: userDetail?.cardNumber,
      CVC: userDetail?.CVC,
      expireMonth: userDetail?.expireMonth,
      expireYear: userDetail?.expireYear,
    })
  }

  closeEditBillingModal(userId: string) {
    this.editBillingModalStates[userId] = false;
  }

  getUsers() {
    this.userService.getUser().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  addUser() {
    if (this.addForm.valid) {
      const isAdmin = this.addForm.get('isAdmin')?.value;
      const name = this.addForm.get('name')?.value;
      const email = this.addForm.get('email')?.value;
      const password = this.addForm.get('password')?.value;
      const telephone = this.addForm.get('telephone')?.value;
      this.webService.signup(isAdmin, name, email, telephone, password).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'User Added!', duration:2000, position:'topCenter'});
        this.getUsers();
        this.closeAddModal();
      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

  editUser() {
    console.log(this.editForm.value);
    if (this.editForm.valid)  {
      const id = this.editForm.get('id')?.value;
      const name = this.editForm.get('name')?.value;
      const email = this.editForm.get('email')?.value;
      const telephone = this.editForm.get('telephone')?.value;
      this.userService.updateUser(id, name, email, telephone).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'User Updated!', duration:2000, position:'topCenter'});
        this.getUsers();
        this.closeEditModal(id);
      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(() => {
      this.userService.deleteUserDetail(id).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'User Deleted!', duration:2000, position:'topCenter'});
        this.closeDeleteModal(id);
        this.getUsers();
      },
        (error) => {
          console.log(error);
          this.toast.error({detail:"ERROR",summary:'Failed to delete user details', duration:2000, position:'topCenter'});
        }
      );
      },
      (error) => {
        console.log(error);
        this.toast.error({detail:"ERROR",summary:'Failed to delete user', duration:2000, position:'topCenter'});
      }
    );
  }
  
  getUserDetails() {
    this.userService.getUserDetail().subscribe((userDetail: UserDetail[]) => {
      this.userDetails= userDetail;
    });
  }

  editUserDetail() {
    if (this.editBillingForm.valid) {
      const id = this.editBillingForm.get('id')?.value;
      const address = this.editBillingForm.get('address')?.value;
      const city = this.editBillingForm.get('city')?.value;
      const postalCode = this.editBillingForm.get('postalCode')?.value;
      const country = this.editBillingForm.get('country')?.value;
      const cardNumber = this.editBillingForm.get('cardNumber')?.value;
      const CVC = this.editBillingForm.get('CVC')?.value;
      const expireMonth = this.editBillingForm.get('expireMonth')?.value;
      const expireYear = this.editBillingForm.get('expireYear')?.value;
      this.userService.updateUserDetail(id, address, city, postalCode, country, cardNumber, CVC, expireMonth, expireYear).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'User Detail Updated!', duration:2000, position:'topCenter'});
        this.getUserDetails();
        this.closeEditBillingModal(id);
      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }
}
