import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { DataService } from "../services/data.service";
import { AppSettings } from "src/app/shared/utils/AppSettings";

@Injectable()
export class BadgeUpdateInterceptor implements HttpInterceptor {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(
    private dataService: DataService,
    private authenticationService: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.getCurrentUser();

    return next.handle(request).pipe(
      tap(
        (event) => {
          if (currentUser) {
            if (event instanceof HttpResponse && event.status === 200) {
              if (
                event.url !== this.endpoint + "dms/profile/getBadge"
              ) {
                if (
                  this.authenticationService.getUserRole() == "BA" ||
                  this.authenticationService.getUserRole() == "BU"
                )
                  this.dataService.updateBadge();
              }
            }
          }
        },
        (error) => {
          // Handle errors if needed
        }
      )
    );
  }
}
