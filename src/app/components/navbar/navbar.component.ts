import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../interface/user.model';
import { AuthService } from '../../service/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.sass'
})

export class NavbarComponent implements OnInit {
  userEmail: string = "";
  constructor(@Inject(DOCUMENT) private document: Document, private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.loginSuccess$.subscribe(() => {
      this.onDisplayChange();
    });
  }

  onDisplayChange() {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      const storedUserId = localStorage.getItem('user-id');
      if (storedUserId) {
        this.userService.getUserById(storedUserId).subscribe((user: User[]) => {
          this.userEmail = user[0].email;
        });
      }
    }
  }

  logout() {
    this.userEmail = "";
    this.authService.logout();
  }
}
