import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, SlickCarouselModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.sass'
})
export class AboutComponent {
  @Input() show: boolean = false;

  featuresSlides = [ 
    { directory: 'https://picsum.photos/536/354?342', description: 'Build recommendations' },
    { directory: 'https://picsum.photos/536/354?342', description: '3D simulation' },
    { directory: 'https://picsum.photos/536/354?342', description: 'Hardware browsing' },
    { directory: 'https://picsum.photos/536/354?342', description: 'Rewards redemption' },
    { directory: 'https://picsum.photos/536/354?342', description: 'Progress tracker' },
    { directory: 'https://picsum.photos/536/354?342', description: 'Compatability Checking' },
    { directory: 'https://picsum.photos/536/354?342', description: 'Step by Step Guide' },
    { directory: 'https://picsum.photos/536/354?342', description: 'Interactive Troubleshooting' },
    { directory: 'https://picsum.photos/536/354?342', description: 'User account management' },
  ]

  slideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": true
  };
}
