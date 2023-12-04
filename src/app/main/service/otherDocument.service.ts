import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppSettings } from "src/app/shared/utils/AppSettings";
import { FileTypeModel } from "../documents/basic-information/file-type.model";
import { OtherSearchModel } from "../other-documents/other-file.model";
import { LoadingService } from "./Loading.service";

@Injectable({ providedIn: "root" })
export class OtehrDocumentService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;
  private endpoint2 = AppSettings.CUSTOMIZE_API_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}
  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
  }

  getAllFileType(
    page: number,
    size: number,
    sort: string,
    order: string
  ): Promise<any> {
    const targetUrl =
      this.endpoint +
      "dms/fileType?page=" +
      page +
      "&size=" +
      size +
      "&sort=" +
      sort +
      order;
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

  getAllFileTypeList(): Promise<FileTypeModel[]> {
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

  acceptOtherDocument(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/otherDocument/complete";
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, request, this.getHttpOptions())
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

  confirmOtherDocument(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/otherDocument/confirm";
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, request, this.getHttpOptions())
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

  createFileType(request: FileTypeModel): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/fileType";
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(targetUrl, request, this.getHttpOptions())
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

  updateFileType(request: FileTypeModel): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/fileType";
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, request, this.getHttpOptions())
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

  deActiveOtherDocument(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/fileType/activation";
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, request, this.getHttpOptions())
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

  getAllOtherSearch(
    page: number,
    size: number,
    sort: string,
    order: string,
    request: OtherSearchModel
  ): Promise<OtherSearchModel[]> {
    let targetUrl =
      this.endpoint +
      "dms/otherDocument/advanceSearch?page=" +
      page +
      "&size=" +
      size +
      "&sort=" +
      sort +
      order;

    return new Promise((resolve, reject) => {
      this.http
        .post<any>(targetUrl, request, this.getHttpOptions())
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

  createOther(request: any): Promise<any> {
    const targetUrl = this.endpoint + "dms/otherDocument";
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("JWT_TOKEN"),
      }),
    };
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(targetUrl, request, httpOptions)
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

  updateOtherInfo(request: any): Promise<any> {
    const targetUrl = this.endpoint + "dms/otherDocument";
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("JWT_TOKEN"),
      }),
    };
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, request, httpOptions)
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

  deleteOtherDocument(id: number): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + `dms/otherDocument/${id}`;
    return new Promise((resolve, reject) => {
      this.http
        .delete<any>(targetUrl, this.getHttpOptions())
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

  sendOtherDocument(id: number): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + `dms/otherDocument/send/${id}`;
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, this.getHttpOptions())
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

  updateOther(documentReuqest: any): Promise<any> {
    const targetUrl =
      this.endpoint + "dms/otherDocument/updateOtherDocumentFile";
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("JWT_TOKEN"),
      }),
    };
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, documentReuqest, httpOptions)
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

  public showContent(id: string) {
    return this.http.get<any>(this.endpoint2 + `getContent/${id}`, {
      observe: `response`,
      responseType: "blob" as "json",
      headers: new HttpHeaders({
        accept: "application/octet-stream",
        Authorization: "Bearer " + localStorage.getItem("JWT_TOKEN"),
      }),
    });
  }

  getOtherById(id: string): Promise<any> {
    const targetUrl = this.endpoint + "dms/otherDocument/" + id;
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
}
