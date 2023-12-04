import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SafeUrl } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { LoadingService } from "../../main/service/Loading.service";
import { AppSettings } from "../../shared/utils/AppSettings";

@Injectable({ providedIn: "root" })
export class FileService {
  private endpoint = AppSettings.CUSTOMIZE_API_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}
  TargetURL: string;
  URL: string;
  image: Blob;
  imageURL: SafeUrl;
  file: Blob;

  public showContent(id: string) {
    return this.http.get<any>(
      this.endpoint + `getContent/${id}`,
      {
        observe: `response`,
        responseType: "blob" as "json",
        headers: new HttpHeaders({
          accept: "application/octet-stream",
          Authorization: "Bearer " + localStorage.getItem("JWT_TOKEN"),
        }),
      }
    );
  }

  public getImage(docId): Observable<Blob> {
    this.loadingService.trueLoadingCounter();
    const url = this.endpoint + "getContent/" + docId;
    var blobObservable = this.http.get(url, {
      responseType: "blob",
    });
    blobObservable
      .toPromise()
      .then((res) => {
        this.loadingService.decreaseLoading();
      })
      .catch((error) => {
        this.loadingService.resetLoadingCounter();
      });
    return blobObservable;
  }

  GetContentByVersion(docId: string, versionId: any): Observable<Blob> {
    this.loadingService.trueLoadingCounter();
    this.TargetURL =
      this.endpoint +
      "getContentByVersion?docId=" +
      docId +
      "&versionId=" +
      versionId;
    var blobObservable = this.http.get(this.TargetURL, {
      responseType: "blob",
    });
    blobObservable.subscribe((res) => {
      this.loadingService.resetLoadingCounter();
    });
    return blobObservable;
  }
}
