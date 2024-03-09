import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass'
})
export class LoginComponent implements OnInit {
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLoginBtnClick(email: string, password: string) {
    this.authService.login(email, password).subscribe((res: HttpResponse<any>) => {
      if (res.status === 200) {
        this.router.navigate(['/shoppingCart']);
      }
      console.log(res);
      
    });
  }
}
