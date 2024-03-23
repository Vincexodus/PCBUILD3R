import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Interface } from 'readline';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {
  
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
  }

  get(uri: string): Observable<any> {
    return this.http.get<any>(`${this.ROOT_URL}/${uri}`);
  }

  post(uri: string, payload: Object): Observable<any> {
    return this.http.post<any>(`${this.ROOT_URL}/${uri}`, payload);
  }

  patch(uri: string, payload: Object): Observable<any> {
    return this.http.patch<any>(`${this.ROOT_URL}/${uri}`, payload);
  }

  delete(uri: string): Observable<any> {
    return this.http.delete<any>(`${this.ROOT_URL}/${uri}`);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/user/login`, {
      email,
      password
    }, {
        observe: 'response'
      });
  }

  signup(isAdmin: boolean, name: string, email: string, telephone: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/user`, {
      isAdmin,
      name,
      email,
      telephone,
      password
    }, {
        observe: 'response'
      });
  }
}
