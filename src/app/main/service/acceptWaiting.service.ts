import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppSettings } from "../../shared/utils/AppSettings";
import { AcceptWaitingModel } from "../brnaches/confirm-package/accept-waiting.model";
import { FileContradictionModel } from "../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { DocumentSetModel } from "../brnaches/manage-document/document-set.model";
import { LoadingService } from "./Loading.service";

@Injectable({ providedIn: "root" })
export class ManageAcceptWaitingService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  getAllDocumentWithSearch(
    page: number,
    size: number,
    sort: string,
    order: string,
    request: DocumentSetModel
  ): Promise<DocumentSetModel[]> {
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

  getDocById(id): Promise<any> {
    const targetUrl = this.endpoint + "dms/document/" + id;

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

  getAllAcceptWaitingSet(
    page: number,
    size: number,
    sort: string,
    order: string
  ): Promise<AcceptWaitingModel[]> {
    const targetUrl =
      this.endpoint +
      "dms/documentSet/acceptWaiting?page=" +
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

  getAllDocumentSetWithSearch(
    page: number,
    size: number,
    sort: string,
    order: string,
    request: DocumentSetModel
  ): Promise<DocumentSetModel[]> {
    let targetUrl =
      this.endpoint +
      "dms/documentSet/advanceSearch?page=" +
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

  getFixedConflictedDocuments(
    page: number,
    size: number,
    sort: string,
    order: string
  ): Promise<FileContradictionModel[]> {
    const targetUrl =
      this.endpoint +
      "dms/document/fixedConflictedDocuments?page=" +
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

  acceptFileDocument(request): Promise<string> {
    const targetUrl = this.endpoint + "dms/document/complete";
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, request, this.getHttpOptions())
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

  getDocumentSetById(uuId: string): Promise<any> {
    const targetUrl = this.endpoint + "dms/documentSet/" + uuId;
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
