import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent implements OnInit {
  loginForm : FormGroup;
  loginLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toast: NgToastService,
    private formBuilder: FormBuilder) {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      });
    }

  ngOnInit() {
  }

  onLoginBtnClick() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.login(email, password).subscribe((res: HttpResponse<any>) => {
        if (res.status === 200) {
          if(res.body.isAdmin) {
            this.toast.success({detail:"SUCCESS",summary:'Admin Login Successful!', duration:2000, position:'topCenter'});
            setTimeout(() => {
              this.router.navigate(['/admin']);
              this.loginForm.reset();
            }, 1000);
          } else {
            this.toast.success({detail:"SUCCESS",summary:'Login Successful!', duration:2000, position:'topCenter'});
            setTimeout(() => {
              this.authService.emitLoginSuccess(true);
              this.router.navigate(['/home']);
              this.loginForm.reset();
            }, 1000);  
          }
        }
      });
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  } 
}
