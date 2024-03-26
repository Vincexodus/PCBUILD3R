import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './terms-of-use.component.html',
  styleUrl: './terms-of-use.component.sass'
})
export class TermsOfUseComponent {
  @Input() show: boolean = false;
  
}
