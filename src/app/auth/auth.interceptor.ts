import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {LoginService} from "../services/login.service";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!request.headers.has('Authorization') ) {
      //console.log("Request doesn't have auth header")
      //console.log(this.loginService.requestHeader)
      const authorization = this.loginService.requestHeader.get('Authorization');
      //console.log(authorization);
      if(authorization) {
        request = request.clone(
          {
            setHeaders: {
              Authorization : authorization
            }
          }
        );
      }
    }
    return next.handle(request).pipe();
  }
}
