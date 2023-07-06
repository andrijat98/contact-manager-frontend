import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterLink} from "@angular/router";
import {LoginService} from "../services/login.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, RouterLink, NgIf]
})
export class AppHeaderComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {}

  loggedInUser = this.loginService.loggedInUser;

  onLogout() {
    this.loginService.logout();
    console.log("Logged out");
    console.log(this.loginService.loggedInUser)
  }

}
