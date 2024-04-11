import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import { Subject, shareReplay, tap } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  localStorage: Storage | undefined  = this.document.defaultView?.localStorage;

  constructor(
    private http: HttpClient, 
    private webService: WebRequestService, 
    private router: Router,
    @Inject(DOCUMENT) private document: Document) { }

  private loginSuccessSubject = new Subject<any>();
  loginSuccess$ = this.loginSuccessSubject.asObservable();

  emitLoginSuccess(value: any) {
    this.loginSuccessSubject.next(value);
  }
  
  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
      })
    )
  }

  signup(name: string, email: string, telephone: string, password: string) {
    return this.webService.signup(false, name, email, telephone, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
      })
    )
  }

  logout() {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  getAccessToken() {
    var accessToken;
    if (this.localStorage) {
      accessToken = this.localStorage.getItem('x-access-token');
    }
    return accessToken;
  }

  getRefreshToken() {
    var refreshToken;
    if (this.localStorage) {
      refreshToken = this.localStorage.getItem('x-refresh-token');
    }
    return refreshToken;
  }

  getUserId() {
    var userId;
    if (this.localStorage) {
      userId = this.localStorage.getItem('user-id');
    }
    return userId;
  }

  setAccessToken(accessToken: string | null) {
    if (this.localStorage) {
      this.localStorage.setItem('x-access-token', accessToken || '');
    }
  }
  
  private setSession(userId: string, accessToken: string | null, refreshToken: string | null) {
    if (this.localStorage) {
      this.localStorage.setItem('user-id', userId);
      this.localStorage.setItem('x-access-token', accessToken || '');
      this.localStorage.setItem('x-refresh-token', refreshToken || '');
    }
  }

  private removeSession() {
    if (this.localStorage) {
      this.localStorage.removeItem('user-id');
      this.localStorage.removeItem('x-access-token');
      this.localStorage.removeItem('x-refresh-token');
    }
  }

  getNewAccessToken() {
    return this.http.get(`${this.webService.ROOT_URL}/user/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken() || '',
        '_id': this.getUserId() || ''
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token') || '');
      })
    );
  }
}
