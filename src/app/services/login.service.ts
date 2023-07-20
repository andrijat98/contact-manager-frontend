import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../interfaces/user.interface";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router:Router, private snackBar: MatSnackBar) { }

  public requestHeader:HttpHeaders = new HttpHeaders();
  public loggedInUser: User = {} as User;

  public login() {

    const requestHeader: HttpHeaders = new HttpHeaders(
      {'Authorization': 'Basic ' + localStorage.getItem('credentials')}
    );

    this.http.get("http://localhost:8080/login", {headers: requestHeader}).subscribe(
      {
        next: (response: any) => {
          this.loggedInUser.tsid = response.tsid;
          this.loggedInUser.firstName = response.firstName;
          this.loggedInUser.lastName = response.lastName;
          this.loggedInUser.email = response.email;
          this.loggedInUser.phoneNumber = response.phoneNumber;
          this.loggedInUser.roles = response.roles;
          this.loggedInUser.isLoggedIn = true;
          this.loggedInUser.isPhoneVerified = response.isPhoneVerified;
          this.requestHeader = requestHeader;
          if(this.checkIfAdmin()) {
            this.router.navigate(['/users']).then()
          } else {
            this.router.navigate(['/contacts']).then()
          }
        },
        error: () => {
          this.snackBar.open('Failed authentication, email or password incorrect.', 'Close', {
            duration: 3000
          })
          this.router.navigate(['/login']).then();
        }
      }
    );
  }

  public logout():void {
    this.requestHeader = new HttpHeaders();
    this.loggedInUser.isLoggedIn = false;
    this.loggedInUser = {} as User;
    localStorage.removeItem('credentials');
    this.router.navigate(['/login']).then();
  }

  public checkIfAdmin(): boolean {
    let isAdmin: boolean = false;
    if (this.loggedInUser.roles == undefined) {
      return false;
    }
    this.loggedInUser.roles.forEach(role => {
      if(role.roleName === 'ROLE_ADMIN') {
        isAdmin = true;
      }
    })
    return isAdmin;
  }
}
