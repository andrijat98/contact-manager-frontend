import { Component } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, NgForm} from "@angular/forms";
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {LoginService} from "../services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, MatButtonModule, MatDividerModule, MatIconModule],
})
export class LoginComponent {

  constructor(private loginService: LoginService) { }

  onSubmit(loginForm: NgForm) {

    const credentials = loginForm.value.username + ":" + loginForm.value.password;

    localStorage.setItem('credentials', btoa(credentials))
    this.loginService.login();
  }

}
