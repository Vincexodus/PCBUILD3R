import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../../service/util.service';
import { Voucher } from '../../../interface/voucher.model';
import { Session } from '../../../interface/session.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SimulationService } from '../../../service/simulation.service';

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
    private simulationService: SimulationService,
    private toast: NgToastService, 
    private util: UtilService,
    private formBuilder: FormBuilder) {
      this.viewForm = this.formBuilder.group({
        id: [{value: '', disabled: true}],
        userId: [{value: '', disabled: true}],
        reviewId: [{value: '', disabled: true}],
        level: [{value: '', disabled: true}],
        createdAt: [{value: '', disabled: true}],
      });
    }
  
  ngOnInit() {
    this.getSession();
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
      reviewId: session?._reviewId,
      level: session?.level,
      createdAt: session?.createdAt,
    })
  }

  closeViewModal(sessionId: string) {
    this.viewModalStates[sessionId] = false;
  }

  getSession() {
    this.simulationService.getSession().subscribe((session: Session[]) => {
      this.sessions = session.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    });
  }

  deletesession(id: string) {
    this.simulationService.deleteSession(id).subscribe(() => {
      this.toast.error({detail:"SUCCESS",summary:'session Deleted!', duration:2000, position:'topCenter'});
      this.getSession();
      this.closeDeleteModal(id);
    }, (error) => {
      console.log(error);
    })
  }
}
