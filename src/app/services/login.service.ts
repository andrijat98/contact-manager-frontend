import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  public login(loginData:any, authHeader:HttpHeaders) {

    return this.http.get("http://localhost:8080/login", {headers: authHeader});
  }
}
