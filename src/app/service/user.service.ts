import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private webReqService: WebRequestService) { }

  // Product Category Routes
  getUser() {
    return this.webReqService.get('user');
  }

  createUser(isAdmin: boolean, username: string, userEmail: string, userPassword: string, userTelephone: string) {
    return this.webReqService.post('user', { isAdmin, username, userEmail, userPassword, userTelephone });
  }

  updateUser(id: string, isAdmin: boolean, username: string, userEmail: string, userPassword: string, userTelephone: string) {
    return this.webReqService.patch(`user/${id}`, { isAdmin, username, userEmail, userPassword, userTelephone  });
  }

  deleteUser(id: string) {
    return this.webReqService.delete(`user/${id}`);
  }
}
