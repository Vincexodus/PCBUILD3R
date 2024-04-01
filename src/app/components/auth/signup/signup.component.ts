import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.sass'
})
export class SignupComponent {
  passwordTally: boolean = true;
  signupForm : FormGroup;
  signupLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router, 
    private toast: NgToastService,
    private formBuilder: FormBuilder) {
      this.signupForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      });
    }

  onSignUpBtnClick() {
    const name = this.signupForm.get('name')?.value;
    const email = this.signupForm.get('email')?.value;
    const telephone = this.signupForm.get('telephone')?.value;
    const password = this.signupForm.get('password')?.value;
    const confirmPassword= this.signupForm.get('confirmPassword')?.value;

    if (this.signupForm.valid) {
      if (password !== confirmPassword) {
        this.passwordTally = false;
      } else {
        this.authService.signup(name, email, telephone, password).subscribe((res: HttpResponse<any>) => {
          if (res.status === 200) {
            this.toast.success({detail:"SUCCESS",summary:'Account Created Successfully, Please relogin!', duration:2000, position:'topCenter'});
            setTimeout(() => {
              this.router.navigate(['/login']);
              this.signupForm.reset();
            }, 2000);
          }
        });
      }
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }
}
