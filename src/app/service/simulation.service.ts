import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  constructor(private webReqService: WebRequestService) { }
  
    // Session route
    getSession() {
      return this.webReqService.get(`session`);
    }

    getSessionByUserId(id: string) {
      return this.webReqService.get(`session/${id}`);
    }
  
    createSession(_userId: string, _productId: string, quantity: Number) {
      return this.webReqService.post(`session`, { _userId, _productId, quantity });
    }
  
    updateSession(_userId: string, _sessionId: string, _productId: string, quantity: Number) {
      return this.webReqService.patch(`session/${_sessionId}`, { _userId, _productId, quantity });
    }
  
    deleteSession(_sessionId: string) {
      return this.webReqService.delete(`session/${_sessionId}`);
    }
  
}
