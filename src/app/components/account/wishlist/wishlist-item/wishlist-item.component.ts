import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wishlist-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-item.component.html',
  styleUrl: './wishlist-item.component.sass'
})
export class WishlistItemComponent {
  @Input() productName: string = "";
  @Input() productDesc1: string = "";
  @Input() productDesc2: string = "";
  @Input() price: number = 0;
  @Input() islastItem: boolean = false;
}
