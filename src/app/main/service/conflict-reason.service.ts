import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppSettings } from "src/app/shared/utils/AppSettings";
import { DocumentSetModel } from "../brnaches/manage-document/document-set.model";
import { ConflictAddReasonModel } from "../documents/basic-information/conflict-reason.model";
import { ConflictSearchModel } from "../documents/basic-information/conflict-search.model";
import { DocumentReasonModel } from "../documents/basic-information/document-request.model";
import { LoadingService } from "./Loading.service";

@Injectable({ providedIn: "root" })
export class ConflictReasonService {
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

  getAllConflictReasons(
    page: number,
    size: number,
    sort: string,
    order: string
  ): Promise<any> {
    const targetUrl =
      this.endpoint +
      "dms/conflictReason?page=" +
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

  getAllDocumentReasons(
    page: number,
    size: number,
    sort: string,
    order: string
  ): Promise<any> {
    const targetUrl =
      this.endpoint +
      "dms/documentRequestReason?page=" +
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

  getAllConflictReasonWithSearch(
    page: number,
    size: number,
    sort: string,
    order: string,
    request: ConflictSearchModel
  ): Promise<DocumentSetModel[]> {
    const targetUrl =
      this.endpoint +
      "dms/conflictReason/search?page=" +
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

  createConflict(request: ConflictAddReasonModel): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/conflictReason";
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

  createReason(request: DocumentReasonModel): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/documentRequestReason";
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

  deActiveConflict(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/conflictReason/activation";
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

  deActiveDocument(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/documentRequestReason/activation";
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

  deleteListConflict(uuIds: number[]): Promise<any> {
    const targetUrl = this.endpoint + "dms/conflictReason/deleteByIds";
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      body: uuIds,
    };
    return new Promise((resolve, reject) => {
      this.http
        .delete<any>(targetUrl, httpOptions)
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

  deleteConflict(id): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/conflictReason/";
    return new Promise((resolve, reject) => {
      this.http
        .delete<any>(targetUrl + id, this.getHttpOptions())
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

  editConflict(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/conflictReason";
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

  editDocument(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/documentRequestReason";
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
}
