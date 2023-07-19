import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../interfaces/user.interface";
import {UserRole} from "../interfaces/userRole.interface";
import {Count} from "../interfaces/count.interface";

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
    return this.http.post<User>(`${this.serverUrl}/user/add`, user);
  }

  public updateUser(editUserData: FormData) {
    return this.http.put<User>(`${this.serverUrl}/user/edit`, editUserData);
  }

  public deleteUser(userTsid: string): Observable<any> {
    return this.http.delete(`${this.serverUrl}/user/delete/${userTsid}`);
  }

  public getAllUserRoles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.serverUrl}/user/get-roles`);
  }

  public countUsers(): Observable<Count> {
    return this.http.get<Count>(`${this.serverUrl}/user/count`);
  }
}
