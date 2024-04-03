import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from '../../service/engine.service';

@Component({
  selector: 'app-pc-canvas',
  standalone: true,
  imports: [],
  templateUrl: './pc-canvas.component.html',
  styleUrl: './pc-canvas.component.sass'
})
export class PcCanvasComponent implements OnInit {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: EngineService) {
  }

  public ngOnInit(): void {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();
  }
}
