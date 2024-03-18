import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminFooterComponent } from './components/admin/admin-footer/admin-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, AdminFooterComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  isAdmin: boolean = false;
  currentMessage: string = 'Hello, World';

  constructor(private router: Router) {
    this.router.events.subscribe(this.onUrlChange.bind(this));
  }

  onUrlChange(event: any) {
    if (event instanceof NavigationEnd) {
      const url = event.url;
      if (url.includes('admin')) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    }
  }
}
