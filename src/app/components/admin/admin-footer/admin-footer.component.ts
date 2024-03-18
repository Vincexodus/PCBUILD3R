import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-footer',
  standalone: true,
  imports: [],
  templateUrl: './admin-footer.component.html',
  styleUrl: './admin-footer.component.sass'
})
export class AdminFooterComponent {
  currYear: number = new Date().getFullYear();
}
