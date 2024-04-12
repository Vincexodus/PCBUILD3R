import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../interface/user.model';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})

export class NavbarComponent implements OnInit {
  userEmail: string = "";
  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.onDisplayChange();
    this.authService.loginSuccess$.subscribe(() => {
      this.onDisplayChange();
    });
  }

  onDisplayChange() {
    const storedUserId = this.authService.getUserId();
    if (storedUserId) {
      this.userService.getUserById(storedUserId).subscribe((user: User[]) => {
        this.userEmail = user[0].email;
      });
    }
  }

  logout() {
    this.userEmail = "";
    this.authService.logout();
  }
}
