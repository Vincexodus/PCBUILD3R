import { CommonModule} from '@angular/common';
import { Component, Input } from '@angular/core';
import { UtilService } from '../../../service/util.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Session } from '../../../interface/session.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from '../../../service/auth.service';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-simulation-session',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './simulation-session.component.html',
  styleUrl: './simulation-session.component.sass'
})

export class SimulationSessionComponent {
  @Input() show: boolean = false;
  sessions: Session[] = []
  viewModalStates: { [sessionId: string]: boolean } = {};
  viewForm: FormGroup;
  page: number = 1;

  constructor(
    private authService: AuthService,
    private userService: UserService,
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
    if (storedUserId) this.getSession(storedUserId);
  }

  formatDate(input: Date): string {
    return this.util.dateFormat(input);
  }

  maskString(input: string): string {
    return this.util.maskString(input);
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

  getSession(userId: string) {
    this.userService.getSessionByUserId(userId).subscribe((session: Session[]) => {
      this.sessions = session.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    });
  }
}
