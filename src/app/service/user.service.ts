import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private webReqService: WebRequestService) { }

  // User Routes
  getUser() {
    return this.webReqService.get('user');
  }

  getUserById(id: string) {
    return this.webReqService.get(`user/${id}`);
  }
  
  updateUser(id: string, username: string, userEmail: string, userTelephone: string) {
    return this.webReqService.patch(`user/${id}`, { username, userEmail, userTelephone  });
  }

  updateUserPassword(id: string, currPassword: string, newPassword: string) {
    return this.webReqService.post(`user/updatePassword/${id}`, { id, currPassword, newPassword });
  }

  deleteUser(id: string) {
    return this.webReqService.delete(`user/${id}`);
  }

  // Email sender
  sendEmail(name: string, email: string, subject: string, message: string) {
    return this.webReqService.post('send-email', { name, email, subject, message });
  }

  // User Detail Routes
  getUserDetail() {
    return this.webReqService.get(`userDetail`);
  }

  getUserDetailById(id: string) {
    return this.webReqService.get(`userDetail/${id}`);
  }

  updateUserDetail(_userId: string, address: string, city: string, postalCode: string, country: string, cardNumber: string,
    CVC: string, expireMonth: string, expireYear: string) {
    return this.webReqService.patch(`userDetail/${_userId}`, { _userId, address, city, postalCode, country, cardNumber, CVC, expireMonth, expireYear  });
  }

  deleteUserDetail(id: string) {
    return this.webReqService.delete(`userDetail/${id}`);
  }

  // Simulation Session Routes
  getSession() {
    return this.webReqService.get(`session`);
  }

  getSessionByUserId(id: string) {
    return this.webReqService.get(`session/${id}`);
  }

  createSession(_userId: string, voucherKey: string, level: number, rating: number, desc: number) {
    return this.webReqService.post(`session`, { _userId, voucherKey, level, rating, desc });
  }

  updateSession(_userId: string, voucherKey: string, level: number, rating: number, desc: number) {
    return this.webReqService.patch(`session/${_userId}`, { _userId, voucherKey, level, rating, desc });
  }

  deleteSession(_sessionId: string) {
    return this.webReqService.delete(`session/${_sessionId}`);
  }
}
