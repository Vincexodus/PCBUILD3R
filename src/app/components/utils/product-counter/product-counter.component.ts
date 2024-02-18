import { Component } from '@angular/core';

@Component({
  selector: 'app-product-counter',
  standalone: true,
  imports: [],
  templateUrl: './product-counter.component.html',
  styleUrl: './product-counter.component.sass'
})
export class ProductCounterComponent {
  min = 1;
  max = 100;
  counterValue = this.min;

  increment() {
    if (this.counterValue < this.max) {
      this.counterValue++;
    }
  }

  decrement() {
    if (this.counterValue > this.min) {
      this.counterValue--;
    }
  }
}