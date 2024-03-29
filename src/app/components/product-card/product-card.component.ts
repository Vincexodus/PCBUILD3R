import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.sass'
})
export class ProductCardComponent {
  @Input() productId : string = "";
  @Input() imageUrl: string | ArrayBuffer | null = "";
  @Input() productName: string = "";
  @Input() rating: number = 0;
  @Input() price: number = 0;
  
  // constructor(private sanitizer: DomSanitizer) {}

  // sanitizeUrl(url: string): SafeUrl {
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }
}
