import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url:string = 'http://3.22.187.30'

  constructor(private http: HttpClient, private cookies: CookieService) { }

  createUser(user:string, pin:string): Observable<void> {
    return this.http.post<void>(`${this.url}/users`, { user, pin })
  }

  verifyUser(user:string, pin:string): Observable<boolean> {
    return this.http.put<boolean>(`${this.url}/users`, { user, pin })
  }

  setCredentials(user:string, pin:string): void {
    this.cookies.set('user', user, 0.1);
    this.cookies.set('pin', pin, 0.1)
  }

  logOut(): void {
    this.cookies.deleteAll();
  }

  getUser(): string {
    return this.cookies.get('user');
  }

  getPin(): string {
    return this.cookies.get('pin');
  }

  setGroups(user: any): void {
    this.cookies.set('groups', user);
  }

  getGroups(): any {
    return this.cookies.get('groups');
  }

  getUserInfo(): Observable<any> {
    return this.http.put<any>(`${this.url}/users/${this.getUser()}`, { pin: this.getPin() } );
  }

  deleteExposure(): Observable<any> {
    return this.http.post<any>(`${this.url}/users/${this.getUser()}`, { pin: this.getPin() } );
  }
}
