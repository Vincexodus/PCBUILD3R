import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { UserService } from '../../../service/user.service';
import { User } from '../../../interface/user.model';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../../../service/auth.service';
import { UserDetail } from '../../../interface/user-detail.model';
import { count } from 'console';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.sass'
})
export class EditProfileComponent implements OnInit {
  @Input() show: boolean = false;
  profileLoading = false;
  passwordLoading = false;
  billingLoading = false;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  billingForm: FormGroup;
  userId: string = "";

  constructor(
    private router: Router, 
    @Inject(DOCUMENT) 
    private document: Document, 
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toast: NgToastService) {

      this.profileForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]],
      });

      this.passwordForm = this.formBuilder.group({
        currPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
        newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      });

      this.billingForm = this.formBuilder.group({
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
    this.getCurrUserInfo();
  }

  getCurrUserInfo() {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      const storedUserId = localStorage.getItem('user-id');
      if (storedUserId) {
        this.userService.getUserById(storedUserId).subscribe((user: User[]) => {
          this.userId = user[0]._id;
          this.profileForm.patchValue({
            name: user[0].name,
            email: user[0].email,
            telephone: user[0].telephone,
          })
          this.getBillingInfo(this.userId);
        });
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  getBillingInfo(userId: string) {
    this.userService.getUserDetailById(userId).subscribe((userDetail: UserDetail[]) => {
      if (userDetail.length !== 0 ) {
        this.billingForm.patchValue({
          address: userDetail[0].address,
          city: userDetail[0].city,
          postalCode: userDetail[0].postalCode,
          country: userDetail[0].country,
          cardNumber: userDetail[0].cardNumber,
          CVC: userDetail[0].CVC,
          expireMonth: userDetail[0].expireMonth,
          expireYear: userDetail[0].expireYear,
        })
      }
    })
  }

  updateProfileInfo() {
    if (this.profileForm.valid) {
      const name = this.profileForm.get('name')?.value;
      const email = this.profileForm.get('email')?.value;
      const telephone = this.profileForm.get('telephone')?.value;

      this.profileLoading = true;
      this.userService.updateUser(this.userId, name, email, telephone).subscribe(() => {
        this.profileLoading = false;
        this.toast.success({detail:"SUCCESS",summary:'Profile Info Updated Successfully!', duration:2000, position:'topCenter'});
      }, (error) => {
        this.profileLoading = false;
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field criteria!', duration:2000, position:'topCenter'});
    }
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      const currPassword = this.passwordForm.get('currPassword')?.value;
      const newPassword = this.passwordForm.get('newPassword')?.value;

      if (currPassword === newPassword) {
        this.toast.error({detail:"FAILED",summary:'New password must be different from the old password.', duration:2000, position:'topCenter'});
      } else {
        this.passwordLoading = true;
        this.userService.updateUserPassword(this.userId, currPassword, newPassword).subscribe(() => {
          this.passwordLoading = false;
          this.toast.success({detail:"SUCCESS",summary:'Password Updated Successfully, Please relogin!', duration:2000, position:'topCenter'});
          setTimeout(() => {
            this.authService.logout();
          }, 2000);
        }, (error) => {
          this.toast.error({detail:"FAILED",summary:'Invalid Password!', duration:2000, position:'topCenter'});
          this.passwordLoading = false;
          console.log(error);
        })
      }
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required fields critera!', duration:2000, position:'topCenter'});
    }
  }

  updateBillingInfo() {
    if (this.billingForm.valid) {
      const address = this.billingForm.get('address')?.value;
      const city = this.billingForm.get('city')?.value;
      const postalCode = this.billingForm.get('postalCode')?.value;
      const country = this.billingForm.get('country')?.value;
      const cardNumber = this.billingForm.get('cardNumber')?.value;
      const CVC = this.billingForm.get('CVC')?.value;
      const expireMonth = this.billingForm.get('expireMonth')?.value;
      const expireYear = this.billingForm.get('expireYear')?.value;

      this.billingLoading = true;
      this.userService.updateUserDetail(this.userId, address, city, postalCode, country, cardNumber, CVC, expireMonth, expireYear).subscribe(() => {
        this.billingLoading = false;
        this.toast.success({detail:"SUCCESS",summary:'Billing Info Updated Successfully!', duration:2000, position:'topCenter'});
      }, (error) => {
        this.billingLoading = false;
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

}
