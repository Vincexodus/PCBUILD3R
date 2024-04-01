import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-order.component.html',
  styleUrl: './admin-order.component.sass'
})
export class AdminOrderComponent {
  @Input() show: boolean = false;

}
