import { Injectable } from '@angular/core';

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LOCAL_STORAGE_CONSTANTS } from 'src/app/constants';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('/api') !== -1) {
        req = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem(LOCAL_STORAGE_CONSTANTS.token)}`)
        });
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json')
      });
    }
    return next.handle(req);

  }
}
