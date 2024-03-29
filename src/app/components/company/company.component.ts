import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, RouterLink, AboutComponent, ContactComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.sass'
})
export class CompanyComponent {
  constructor(private route: ActivatedRoute) {}

  isActiveTab(tab: string): boolean {
    return this.route.snapshot.firstChild?.routeConfig?.path === tab;
  }
}