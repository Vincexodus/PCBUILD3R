import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.sass'
})
export class OrderHistoryComponent {
  @Input() show: boolean = false;

  getNumberArray(n: number): number[] {
    return Array.from({ length: n }, (_, index) => index + 1);
  }
}
