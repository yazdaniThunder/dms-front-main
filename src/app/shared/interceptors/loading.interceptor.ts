import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from "../services/loader.service";
import { AppSettings } from "src/app/shared/utils/AppSettings";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(private loadingService: LoaderService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Check if the request URL is not "dms/profile/getBadge"
    if (request.url !== this.endpoint + "dms/profile/getBadge") {
      this.totalRequests++;
      this.loadingService.setLoading(true);
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (request.url !== this.endpoint + "dms/profile/getBadge") {
          this.totalRequests--;
          if (this.totalRequests === 0) {
            this.loadingService.setLoading(false);
          }
        }
      })
    );
  }
}
