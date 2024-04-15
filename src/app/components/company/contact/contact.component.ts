import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.sass'
})

export class ContactComponent {
  @Input() show: boolean = false;
  contactForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private toast: NgToastService,
    private userService: UserService
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', Validators.required]
    });
  }

  handleFormSubmit(): void {
    if (this.contactForm.valid) {
      const nameControl = this.contactForm.get('name');
      const emailControl = this.contactForm.get('email');
      const subjectControl = this.contactForm.get('subject');
      const messageControl = this.contactForm.get('message');
      
      this.loading = true;
      this.userService.sendEmail(nameControl?.value, emailControl?.value, subjectControl?.value, messageControl?.value).subscribe(
        () => {
          this.contactForm.reset();
          this.loading = false;
          this.toast.success({detail:"SUCCESS",summary:'Message sent successfully!', duration:2000, position:'topCenter'});
        },
        (error) => {
          this.loading = false;
          this.toast.error({detail:"FAILED",summary:`Error sending message: ${error}`, duration:2000, position:'topCenter'});
        }
      );
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required fields!', duration:2000, position:'topCenter'});
    }
  }
}
