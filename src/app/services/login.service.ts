import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {User} from "../interfaces/user.interface";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router:Router) { }

  public requestHeader:HttpHeaders = new HttpHeaders();
  public loggedInUser: User = {} as User;

  public login(loginData:any) {

    const credentials = loginData.value.username + ":" + loginData.value.password;
    const requestHeader = new HttpHeaders(
      {'Authorization': 'Basic ' + btoa(credentials)}
    );

    this.http.get("http://localhost:8080/login", {headers: requestHeader}).subscribe(
      {
        next: (response: any) => {
          console.log('Login successful');
          this.loggedInUser.tsid = response.tsid;
          this.loggedInUser.firstName = response.firstName;
          this.loggedInUser.lastName = response.lastName;
          this.loggedInUser.email = response.email;
          this.loggedInUser.roles = [];
          for (let role of response.roles) {
            this.loggedInUser.roles.push(role.roleName);
          }
          this.loggedInUser.isLoggedIn = true;
          this.requestHeader = requestHeader
          this.router.navigate(['/contacts']).then()
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.message)
        }
      }
    );
  }

  public logout():void {
    this.requestHeader = new HttpHeaders();
    this.loggedInUser.isLoggedIn = false;
    this.loggedInUser = {} as User;
    this.router.navigate(['/login']).then();
  }

  public checkIfAdmin(): boolean {
    return this.loggedInUser.roles.includes('ROLE_ADMIN')
  }
}
