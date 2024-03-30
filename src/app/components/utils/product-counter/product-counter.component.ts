import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-product-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-counter.component.html',
  styleUrl: './product-counter.component.sass'
})
export class ProductCounterComponent implements OnInit {
  @Output() counterChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() productId: string = "";
  @Input() inputCounter: number = 0;
  min = 1;
  max = 100;
  counterValue = this.min;

  ngOnInit() {
    if (this.inputCounter > 0) {
      this.counterValue = this.inputCounter;
    }
  }

  private emitCounterValue() {
    this.counterChange.emit(this.counterValue);
  }

  increment() {
    if (this.counterValue < this.max) {
      this.counterValue++;
      this.emitCounterValue();
    }
  }

  decrement() {
    if (this.counterValue > this.min) {
      this.counterValue--;
      this.emitCounterValue();
    }
  }
}