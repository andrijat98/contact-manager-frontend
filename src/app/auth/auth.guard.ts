import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {LoginService} from "../services/login.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const requiresAdmin = route.data['requiresAdmin'];
    const requiresLogin = route.data['requiresLogin'];

    if (requiresAdmin && !this.loginService.checkIfAdmin()) {
      this.router.navigate(['/login']).then();
      return false;
    }

    if (requiresLogin && !this.loginService.loggedInUser.isLoggedIn) {
      this.router.navigate(['/login']).then();
      return false;
    }
    return true;
  }
}
