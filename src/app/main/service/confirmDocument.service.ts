import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppSettings } from "../../shared/utils/AppSettings";
import { FileContradictionModel } from "../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { LoadingService } from "./Loading.service";

@Injectable({ providedIn: "root" })
export class ConfirmDocumentService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  primaryConfirmAndConflicted(
    page: number,
    size: number,
    sort: string,
    order: string
  ): Promise<any[]> {
    const targetUrl =
      this.endpoint +
      "dms/document/primaryConfirmAndConflicted?page=" +
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

  getAllDocumentWithSearch(
    page: number,
    size: number,
    sort: string,
    order: string,
    request: FileContradictionModel
  ): Promise<FileContradictionModel[]> {
    let targetUrl =
      this.endpoint +
      "dms/document/advanceSearch?page=" +
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

  acceptDocument(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/documentSet/complete";
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

  acceptFile(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/document/complete";
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

  stagnateFile(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/document/toStagnateDocument";
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

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
  }
}
