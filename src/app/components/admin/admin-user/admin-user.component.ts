import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../interface/product.model';
import { NgToastService } from 'ng-angular-popup';
import { UtilService } from '../../../service/util.service';
import { ProductService } from '../../../service/product.service';
import { FormsModule } from '@angular/forms';
import { ProductCategory } from '../../../interface/product-category.model';
import { User } from '../../../interface/user.model';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-admin-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user.component.html',
  styleUrl: './admin-user.component.sass'
})
export class AdminUserComponent {
  @Input() show: boolean = false;
  users!: User[];
  isAddModalActive: boolean = false;
  selectedUserId: string = "";
  editUserType: boolean = false;
  editUserName: string = "";
  editUserEmail: string = "";
  editUserPassword: string = "";
  editUserTel: string | "" = "";
  deleteModalStates: { [userId: string]: boolean } = {};
  editModalStates: { [userId: string]: boolean } = {};

  constructor(private userService: UserService, private toast: NgToastService, private util: UtilService) { }

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
    this.editUserName = user ? user.name : '';
    this.editUserEmail = user ? user.email : '';
    this.editUserPassword = user ? user.password : '';
    this.editUserTel = user ? user.telephone : '';
  }

  closeEditModal(userId: string) {
    this.editModalStates[userId] = false;
  }

  getUsers() {
    this.userService.getUser().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  addUser(isAdmin: boolean, username: string, userEmail: string, userPassword: string, userTelephone: string) {
    if (!this.util.strValidation(username, userEmail, userPassword, userTelephone)) {
      this.userService.createUser(isAdmin, username, userEmail, userPassword, userTelephone).subscribe(() => {
        this.toast.success({detail:"SUCCESS",summary:'User Added!', duration:2000, position:'topCenter'});
        this.getUsers();
        this.closeAddModal();
      }, (error) => {
        console.log(error);
      })
    }
  }

  editUser(id: string, username: string, userEmail: string, userTelephone: string) {
    if (!this.util.strValidation(username, userEmail, userTelephone))  {
      this.userService.updateUser(id, username, userEmail, userTelephone).subscribe(() => {
        this.toast.warning({detail:"SUCCESS",summary:'User Updated!', duration:2000, position:'topCenter'});
        this.getUsers();
        this.closeEditModal(id);
      }, (error) => {
        console.log(error);
      })
    }
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(() => {
      this.toast.error({detail:"SUCCESS",summary:'User Deleted!', duration:2000, position:'topCenter'});
      this.getUsers();
      this.closeDeleteModal(id);
    }, (error) => {
      console.log(error);
    })
  }
}
