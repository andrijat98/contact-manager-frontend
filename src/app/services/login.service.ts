import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  public login(loginData:any) {

    const credentials = loginData.username + ":" + loginData.password;

    const requestHeader = new HttpHeaders(
      {'Authorization': 'Basic ' + btoa(credentials)}
    );

    return this.http.get("http://localhost:8080/login", {headers: requestHeader});
  }
}
