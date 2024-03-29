import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-product-counter',
  standalone: true,
  imports: [],
  templateUrl: './product-counter.component.html',
  styleUrl: './product-counter.component.sass'
})
export class ProductCounterComponent implements OnInit {
  @Output() counterChange: EventEmitter<number> = new EventEmitter<number>();
  min = 1;
  max = 100;
  counterValue = this.min;

  ngOnInit() {
    this.emitCounterValue();
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