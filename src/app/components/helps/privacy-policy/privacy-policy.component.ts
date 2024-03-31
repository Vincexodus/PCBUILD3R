import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.sass'
})
export class PrivacyPolicyComponent {
  @Input() show: boolean = false;
  
}
