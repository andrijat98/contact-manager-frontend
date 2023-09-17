import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const credentials = localStorage.getItem('credentials')
    if(credentials) {
      //console.log("Request doesn't have auth header")
      //console.log(this.loginService.requestHeader)
      //const authorization = this.loginService.requestHeader.get('Authorization');
        request = request.clone(
          {
            setHeaders: {
              Authorization : 'Basic ' + credentials
            }
          }
        );
    }
    return next.handle(request).pipe();
  }
}
