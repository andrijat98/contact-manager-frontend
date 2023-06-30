import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  requestHeader = new HttpHeaders(
    { 'Content-Type': 'multipart/form-data' }
  );

  public login(loginData:any) {

    const formData: FormData = new FormData();
    formData.append('username', loginData.username)
    formData.append('password', loginData.password)

    return this.http.post("http://localhost:8080/login", formData, {withCredentials: true});
  }
}
