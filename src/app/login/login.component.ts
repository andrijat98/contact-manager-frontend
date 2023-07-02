import { Component, OnInit } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, NgForm} from "@angular/forms";
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {LoginService} from "../services/login.service";
import {HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {User} from "../interfaces/user.interface";
import {AuthInterceptor} from "../auth/auth.interceptor";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, MatButtonModule, MatDividerModule, MatIconModule],
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService, private authInterceptor: AuthInterceptor) { }

  ngOnInit(): void {
  }

  loggedInUser: User = {} as User;

  onSubmit(loginForm: NgForm) {

    const credentials = loginForm.value.username + ":" + loginForm.value.password;
    const requestHeader = new HttpHeaders(
      {'Authorization': 'Basic ' + btoa(credentials)}
    );
    this.loginService.login(loginForm.value, requestHeader).subscribe(
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
          this.authInterceptor.setRequestHeader(requestHeader)
          console.log(this.loggedInUser);
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message)
        }
      }
    );
  }
}
