import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { LOCAL_STORAGE_CONSTANTS } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
   
    return this.authService.isLoggedIn         
      .pipe(
        take(1),                              
        map((isLoggedIn: boolean) => {         
          if (!isLoggedIn){
            this.router.navigate(['/login']); 
            return false;
          }
          return true;
        })
      )
  }
}
