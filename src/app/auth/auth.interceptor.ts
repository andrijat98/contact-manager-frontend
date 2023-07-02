import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  private requestHeader:HttpHeaders = new HttpHeaders();

  public getRequestHeader(): HttpHeaders {
    return this.requestHeader;
  }

  public setRequestHeader(value: HttpHeaders) {
    this.requestHeader = value;
    console.log("request header is now: " + this.requestHeader.keys())
  }

  constructor() {

  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if(!request.headers.has('Authorization') ) {

      const header = this.getRequestHeader().get('Authorization');
      if(header) {
        request = request.clone(
          {
            setHeaders: {
              Authorization : header
            }
          }
        );
      }
    }
    return next.handle(request).pipe();
  }
}
