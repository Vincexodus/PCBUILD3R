import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../../service/util.service';
import { Session } from '../../../interface/session.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../../service/auth.service';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-admin-session',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './admin-session.component.html',
  styleUrl: './admin-session.component.sass'
})

export class AdminSessionComponent {
  @Input() show: boolean = false;
  sessions!: Session[];
  deleteModalStates: { [sessionId: string]: boolean } = {};
  viewModalStates: { [sessionId: string]: boolean } = {};
  viewForm: FormGroup;
  page: number = 1;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: NgToastService, 
    private util: UtilService,
    private formBuilder: FormBuilder) {
      this.viewForm = this.formBuilder.group({
        id: [{value: '', disabled: true}],
        userId: [{value: '', disabled: true}],
        voucherKey: [{value: '', disabled: true}],
        level: [{value: '', disabled: true}],
        rating: [{value: '', disabled: true}],
        desc: [{value: '', disabled: true}],
        createdAt: [{value: '', disabled: true}],
      });
    }
  
  ngOnInit() {
    const storedUserId = this.authService.getUserId();
    if (storedUserId) {
      this.getSession();
    }
  }

  sessionSearch(keyword: string): void {
    if (keyword.length != 0) {
      this.sessions = this.sessions.filter(s =>
        s._userId.includes(keyword.toLowerCase())
      );
    } else {
      this.getSession();
    }
  }

  formatDate(input: Date): string {
    return this.util.dateFormat(input);
  }

  maskString(input: string): string {
    return this.util.maskString(input);
  }

  openDeleteModal(sessionId: string) {
    this.deleteModalStates[sessionId] = true;
  }

  closeDeleteModal(sessionId: string) {
    this.deleteModalStates[sessionId] = false;
  }
  
  openViewModal(sessionId: string) {
    this.viewModalStates[sessionId] = true;
    const session = this.sessions.find(s => s._id === sessionId);
    this.viewForm.patchValue({
      id: session?._id,
      userId: session?._userId,
      voucherKey: session?.voucherKey,
      level: session?.level,
      rating: session?.rating,
      desc: session?.desc,
      createdAt: session?.createdAt,
    })
  }

  closeViewModal(sessionId: string) {
    this.viewModalStates[sessionId] = false;
  }

  getSession() {
    this.userService.getSession().subscribe((session: Session[]) => {
      this.sessions = session.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    });
  }

  deletesession(id: string) {
    this.userService.deleteSession(id).subscribe(() => {
      this.toast.error({detail:"SUCCESS",summary:'session Deleted!', duration:2000, position:'topCenter'});
      this.getSession();
      this.closeDeleteModal(id);
    }, (error) => {
      console.log(error);
    })
  }
}
