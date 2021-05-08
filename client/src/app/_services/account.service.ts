import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/';
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }


  register(model: any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User)=>{
        if(user){
          this.currentUserSource.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
        return user;
      })
    )
  }

  login(model: any){
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User)=>{
        const user = response;
        if(user){
          this.setCurrentUser(user);
          return response;
        }
      })
    );
  }

  setCurrentUser(user: User){
    user.roles = [];
    const roles = this.getDecodeToken(user.token).role;
    Array.isArray(roles)? user.roles = roles : user.roles.push(roles);
    
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getDecodeToken(token){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
