import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { FaqComponent } from './faq/faq.component';
import { CommonModule } from '@angular/common';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';

@Component({
  selector: 'app-helps',
  standalone: true,
  imports: [CommonModule, RouterLink, PrivacyPolicyComponent, TermsOfUseComponent, FaqComponent],
  templateUrl: './helps.component.html',
  styleUrl: './helps.component.sass'
})
export class HelpsComponent {
  constructor(private route: ActivatedRoute) {}

  isActiveTab(tab: string): boolean {
    return this.route.snapshot.firstChild?.routeConfig?.path === tab;
  }
}
