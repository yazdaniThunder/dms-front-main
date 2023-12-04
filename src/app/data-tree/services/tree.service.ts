import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "../../shared/utils/AppSettings";
import { LoadingService } from "../../main/service/Loading.service";

@Injectable({ providedIn: "root" })
export class TreeService {
  private endpoint = AppSettings.CUSTOMIZE_API_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  callApiDocNoFolder(uuId: string): Promise<string> {
    this.loadingService.trueLoadingCounter();
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(
          this.endpoint + "documents?folderUuid=" + uuId,
          this.getHttpOptions()
        )
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

  getFolder(uuId): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(
          uuId === null
            ? this.endpoint + "folders"
            : this.endpoint + "folders?folderUuid=" + uuId,
          this.getHttpOptions()
        )
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

  getPath(uuId): Promise<any> {
    const url = this.endpoint + "getPath/" + uuId;
    return new Promise((resolve, reject) => {
      var blobObservable = this.http.get(url, {
        responseType: "text",
      });
      blobObservable.toPromise().then(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
  }

  getDocumentProperties(uuId: string): Promise<string> {
    const targetUrl = this.endpoint + "getProperties?docId=" + uuId;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return new Promise((resolve, reject) => {
      this.http
        .get<any>(targetUrl, httpOptions)
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
}
