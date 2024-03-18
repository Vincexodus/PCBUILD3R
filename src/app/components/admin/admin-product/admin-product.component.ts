import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PaginationComponent } from '../../utils/pagination/pagination.component';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.sass'
})
export class AdminProductComponent {
  @Input() show: boolean = false;
  
  getNumberArray(n: number): number[] {
    return Array.from({ length: n }, (_, index) => index + 1);
  }

  isActive: boolean = false;

  openModal(): void {
    this.isActive = true;
  }

  closeModal(): void {
    this.isActive = false;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal();
    }
  }
}
