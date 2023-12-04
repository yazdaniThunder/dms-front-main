import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((err) => {
        if (
          err.status === 401 &&
          (err.error.message !== "Token expired or invalid." ||
            err.error.status !== 403)
        ) {
          this.authenticationService.logout();
          this.router.navigate(["register/login"]);
        } else if (err.status === 403) {
          // this.router.navigate(["register/login"]);
        }
        return throwError(err);
      })
    );
  }
}
