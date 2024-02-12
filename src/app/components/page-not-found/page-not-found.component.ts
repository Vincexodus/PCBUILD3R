import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.sass'
})
export class PageNotFoundComponent {
  constructor(private router: Router) { }

  returnToHome() {
    this.router.navigate(['/home']);
  }
}
