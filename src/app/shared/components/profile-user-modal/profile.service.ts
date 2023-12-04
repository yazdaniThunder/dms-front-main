import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { LoadingService } from "src/app/main/service/Loading.service";
import { AppSettings } from "../../utils/AppSettings";

@Injectable({ providedIn: "root" })
export class ManageDocumentService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {}

  getProfilebyId(id: any): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/profile/getById/";
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(targetUrl+id, this.getHttpOptions())
        .toPromise()
        .then(
          (data) => {
            this.loadingService.decreaseLoading();
            resolve(data);
          },
          (error) => {
            this.loadingService.resetLoadingCounter();
            reject(error);
          }
        );
    });
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
  }
}
