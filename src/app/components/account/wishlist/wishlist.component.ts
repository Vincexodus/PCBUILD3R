import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { WishlistItemComponent } from './wishlist-item/wishlist-item.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, WishlistItemComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.sass'
})
export class WishlistComponent {
  @Input() show: boolean = false;
}
