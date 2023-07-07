import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../interfaces/user.interface";
import {ModifyUser} from "../interfaces/modify.user.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private serverUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.serverUrl}/user/get-all/page/0/size/10/sort-by/firstName`);
  }

  public addUser(user: FormData) {
    return this.http.post<ModifyUser>(`${this.serverUrl}/user/add`, user);
  }
}
