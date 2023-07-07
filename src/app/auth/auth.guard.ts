import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {LoginService} from "../services/login.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  canActivate() {
    if (this.loginService.loggedInUser.isLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']).then(() => {});
      return false;
    }
  }
}
