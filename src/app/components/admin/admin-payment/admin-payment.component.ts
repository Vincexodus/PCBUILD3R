import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-payment.component.html',
  styleUrl: './admin-payment.component.sass'
})
export class AdminPaymentComponent {
  @Input() show: boolean = false;

}
