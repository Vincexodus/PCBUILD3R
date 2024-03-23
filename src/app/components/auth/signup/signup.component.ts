import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.sass'
})
export class SignupComponent implements OnInit{
  passwordTally: boolean = true;

  constructor(private authService: AuthService, private router: Router, private toast: NgToastService) { }

  ngOnInit() {
  }

  onSignUpBtnClick(name: string, email: string, telephone: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      this.passwordTally = false;
    } else {
      this.authService.signup(name, email, telephone, password).subscribe((res: HttpResponse<any>) => {
        if (res.status === 200) {
          this.router.navigate(['/shoppingCart']);
        } else {
          this.toast.error({detail:"FAILED",summary:'Invalid User Credentials!', duration:2000, position:'topCenter'});
        }
        console.log(res);
        
      });
    }
  }
}
