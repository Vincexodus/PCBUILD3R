import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private webReqService: WebRequestService) { }
  
    // Session route
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
