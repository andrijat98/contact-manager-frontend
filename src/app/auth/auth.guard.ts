import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {LoginService} from "../services/login.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const requiresAdmin = route.data['requiresAdmin'];
    const requiresLogin = route.data['requiresLogin'];

    if (requiresAdmin && !this.loginService.checkIfAdmin()) {
      return false;
    }

    return !(requiresLogin && !this.loginService.loggedInUser.isLoggedIn);

  }
}
