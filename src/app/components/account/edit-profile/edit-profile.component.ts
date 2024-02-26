import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.sass'
})
export class EditProfileComponent {
  @Input() show: boolean = false;
}
