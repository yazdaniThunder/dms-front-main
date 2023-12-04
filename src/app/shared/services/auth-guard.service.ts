import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
  UrlTree,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const userRole = localStorage.getItem("roleName");

    if (userRole) {
      const requiredRoles = route.data.roles as string[];

      if (requiredRoles && requiredRoles.includes(userRole)) {
        return true; // User has the required role
      }
    }

    // If the user does not have the required role or the user role is not defined, navigate to the forbidden page
    this.router.navigate(["error/forbidden-page"]);
    return false;
  }
}
