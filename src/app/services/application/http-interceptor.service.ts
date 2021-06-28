import { Injectable } from '@angular/core';

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LOCAL_STORAGE_CONSTANTS } from 'src/app/constants';
import { tap } from 'rxjs/operators';

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
    return next.handle(req).pipe(
      tap((httpEvent: HttpEvent<any>) =>{
        if (req.url.indexOf('/login') !== -1) {
          // Skip request
          if(httpEvent.type === 0){
            return;
        }           
        console.log("response: ", httpEvent);

        if (httpEvent instanceof HttpResponse) {
            if(httpEvent.headers.has('Authorization')) {
                let token = httpEvent.headers.get('Authorization');
                if (token != null) {
                  localStorage.setItem(LOCAL_STORAGE_CONSTANTS.token,   token.substring(7));
                }
                
            }
        }
        }
      })

  );

  }
}
