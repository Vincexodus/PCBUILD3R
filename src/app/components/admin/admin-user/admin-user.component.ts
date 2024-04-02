import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../../service/util.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../interface/user.model';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.sass'
})

export class AdminUserComponent {
  @Input() show: boolean = false;
  users!: User[];
  isAddModalActive: boolean = false;
  deleteModalStates: { [userId: string]: boolean } = {};
  editModalStates: { [userId: string]: boolean } = {};
  addForm: FormGroup;
  editForm: FormGroup;

  constructor(
    private userService: UserService, 
    private toast: NgToastService, 
    private util: UtilService,
    private formBuilder: FormBuilder) {
      this.addForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]],
      });

      this.editForm = this.formBuilder.group({
        id: [{value: '', disabled: true}],
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(9), Validators.maxLength(10)]],
      });
    }

  ngOnInit() {
    this.getUsers();
  }

  userSearch(keyword: string): void {
    if (keyword.length != 0) {
      this.users = this.users.filter(user =>
        user.name.toLowerCase().includes(keyword.toLowerCase())
      );
    } else {
      this.getUsers();
    }
  }
  
  maskString(input: string): string {
    return this.util.maskString(input);
  }

  openAddModal(): void {
    this.isAddModalActive = true;
  }

  closeAddModal(): void {
    this.isAddModalActive = false;
  }

  openDeleteModal(userId: string) {
    this.deleteModalStates[userId] = true;
  }

  closeDeleteModal(userId: string) {
    this.deleteModalStates[userId] = false;
  }
  
  openEditModal(userId: string) {
    this.editModalStates[userId] = true;
    const user = this.users.find(user => user._id === userId);
    this.editForm.patchValue({
      id: user?._id,
      name: user?.name,
      email: user?.email,
      telephone: user?.telephone,
    })
  }

  closeEditModal(userId: string) {
    this.editModalStates[userId] = false;
  }

  getUsers() {
    this.userService.getUser().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  addUser() {
    if (this.addForm.valid) {
      const name = this.addForm.get('name')?.value;
      const email = this.addForm.get('email')?.value;
      const telephone = this.addForm.get('telephone')?.value;
      this.userService.createUser(true, name, email, "test", telephone).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'User Added!', duration:2000, position:'topCenter'});
        this.getUsers();
        this.closeAddModal();
      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

  editUser() {
    if (this.editForm.valid)  {
      const id = this.editForm.get('id')?.value;
      const name = this.editForm.get('name')?.value;
      const email = this.editForm.get('email')?.value;
      const telephone = this.editForm.get('telephone')?.value;
      this.userService.updateUser(id, name, email, telephone).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'User Updated!', duration:2000, position:'topCenter'});
        this.getUsers();
        this.closeEditModal(id);
        this.addForm.reset();
      }, (error) => {
        console.log(error);
      })
    } else {
      this.toast.error({detail:"FAILED",summary:'Please fill in all required field critera!', duration:2000, position:'topCenter'});
    }
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(() => {
      this.toast.success({detail:"SUCCESS",summary:'User Deleted!', duration:2000, position:'topCenter'});
      this.getUsers();
      this.closeDeleteModal(id);
      this.editForm.reset();
    }, (error) => {
      console.log(error);
    })
  }
}
