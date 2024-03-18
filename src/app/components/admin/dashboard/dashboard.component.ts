import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.sass'
})
export class DashboardComponent {
  @Input() show: boolean = false;

  getNumberArray(n: number): number[] {
    return Array.from({ length: n }, (_, index) => index + 1);
  }
}
