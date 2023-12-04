import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, finalize, switchMap, take } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshingToken = false;
  private tokenRefreshSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private authenticationService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const currentUser = this.authenticationService.getCurrentUser();
    if (currentUser) {
      if (!request.headers.get("authorization")) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser}`,
          },
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 401 &&
          error.error.message === "Token expired or invalid."
        ) {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.tokenRefreshSubject.next(null);

            return this.handleTokenExpired(request, next);
          } else {
            return this.tokenRefreshSubject.pipe(
              filter((result) => result !== null),
              take(1),
              switchMap(() =>
                next.handle(
                  this.addToken(
                    request,
                    this.authenticationService.getCurrentUser()
                  )
                )
              )
            );
          }
        }
        return throwError(error);
      })
    );
  }

  private handleTokenExpired(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    return this.authenticationService.RefreshToken().pipe(
      switchMap((data) => {
        const newToken = data.accessToken;
        this.authenticationService.setCurrentUser(newToken);
        this.tokenRefreshSubject.next(data);

        const modifiedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`,
          },
        });

        return next.handle(modifiedRequest).pipe(
          catchError((error) => {
            this.router.navigate(["register/login"]);
            return throwError(error);
          })
        );
      }),
      catchError((error) => {
        this.authenticationService.logout();
        this.router.navigate(["register/login"]);
        return throwError(error);
      }),
      finalize(() => {
        this.isRefreshingToken = false;
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
