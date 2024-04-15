import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EngineService } from '../../../service/engine.service';

@Component({
  selector: 'app-intro-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './intro-card.component.html',
  styleUrl: './intro-card.component.sass'
})

export class IntroCardComponent{
  @ViewChild('rendererCanvas', { static: true })
  
  rendererCanvas!: ElementRef<HTMLCanvasElement>;
  feature = [
    { name: "Choose From Multiple Levels of Approach", icon: "fa-solid fa-layer-group" },
    { name: "Learn Through an Interactive Guidance", icon: "fa-solid fa-hand-holding-hand" },
    { name: "Visualize Your PC Build in Real-time 3D", icon: "fa-solid fa-hourglass-start" },
    { name: "Make Adjustments and See Instant Updates", icon: "fa-solid fa-sliders" },
    { name: "Earn Vouchers for a Shopping Spree", icon: "fa-solid fa-money-bill" },
  ]

  constructor(private engServ: EngineService) {
  }

  ngOnInit(): void {
    this.engServ.createIntroScene(this.rendererCanvas);
    // this.engServ.animate();
  }
}
