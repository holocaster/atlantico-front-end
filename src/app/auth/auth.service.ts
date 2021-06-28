import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LOCAL_STORAGE_CONSTANTS } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  private helper = new JwtHelperService();


  get isLoggedIn() {
    const token = localStorage.getItem(LOCAL_STORAGE_CONSTANTS.token);
    if (token == null) {
      this.loggedIn.next(false);
    } else {
      const logado = this.helper.isTokenExpired(token);
      if (logado) {
        console.log("Token expirado");
      }
      this.loggedIn.next(!logado);
    }
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router
  ) {}

  login(){
      this.router.navigate(['/']);
  }

  isAdmin() {
    const token = localStorage.getItem(LOCAL_STORAGE_CONSTANTS.token);
    if (token != null) {
      const decodedToeken = this.helper.decodeToken(token);
      return decodedToeken['admin'];
    }
  }

  logout() {                            
    this.loggedIn.next(false);
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
