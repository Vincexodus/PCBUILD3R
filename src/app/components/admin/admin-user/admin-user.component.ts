import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.sass'
})
export class AdminUserComponent {
  @Input() show: boolean = false;

}
