import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { AppSettings } from "../../shared/utils/AppSettings";
import { LoadingService } from "./Loading.service";

@Injectable({ providedIn: "root" })
export class ReportService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {}

  getExcelReport(request: any): Observable<Blob> {
    const targetUrl = this.endpoint + "dms/documentSet/reportExcel";

    var blobObservable = this.http.post(targetUrl, request, {
      responseType: "blob",
    });
    blobObservable
      .toPromise()
      .then((res) => {
        this.loadingService.decreaseLoading();
      })
      .catch((error) => {
        this.loadingService.resetLoadingCounter();
        this.toastr.error("دانلود فایل با مشکل مواجه شد!");
      });
    return blobObservable;
  }

  getAllFileTypeList(): Promise<any[]> {
    const targetUrl = this.endpoint + "dms/fileType/getList";
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(targetUrl, this.getHttpOptions())
        .toPromise()
        .then(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }
  
  getDocumentExcelReport(request: any): Observable<Blob> {
    const targetUrl = this.endpoint + "dms/document/reportExcel";

    var blobObservable = this.http.post(targetUrl, request, {
      responseType: "blob",
    });
    blobObservable
      .toPromise()
      .then((res) => {
        this.loadingService.decreaseLoading();
      })
      .catch((error) => {
        this.loadingService.resetLoadingCounter();
        this.toastr.error("دانلود فایل با مشکل مواجه شد!");
      });
    return blobObservable;
  }

  getAllBranchesList(): Promise<any> {
    const targetUrl = this.endpoint + "dms/branches/getAllBranch";
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(targetUrl, this.getHttpOptions())
        .toPromise()
        .then(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getAllBranchesAssignList(): Promise<any> {
    const targetUrl = this.endpoint + "dms/branches/getAssignedBranch";
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(targetUrl, this.getHttpOptions())
        .toPromise()
        .then(
          (data) => {
            resolve(data);
          },
          (error) => {
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
