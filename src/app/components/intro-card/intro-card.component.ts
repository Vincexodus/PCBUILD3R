import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { response } from 'express';

@Component({
  selector: 'app-intro-card',
  standalone: true,
  imports: [],
  templateUrl: './intro-card.component.html',
  styleUrl: './intro-card.component.sass'
})
export class IntroCardComponent implements OnInit{
  
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
      
  }
}
