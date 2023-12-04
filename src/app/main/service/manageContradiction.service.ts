import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppSettings } from "../../shared/utils/AppSettings";
import { FileContradictionModel } from "../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { DocumentSetModel } from "../brnaches/manage-document/document-set.model";
import { LoadingService } from "./Loading.service";

@Injectable({ providedIn: "root" })
export class ManageContradictionService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  upload(documentSetId: number, file): Observable<any> {
    const targetUrl =
      this.endpoint + "dms/documentSet/scan?documentSetId=" + documentSetId;
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post(targetUrl, formData, this.getHttpOptions());
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

  reread(documentSetId: number, file): Observable<any> {
    const targetUrl =
      this.endpoint + "dms/documentSet/reread?documentSetId=" + documentSetId;
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post(targetUrl, formData, this.getHttpOptions());
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

  getconflictedDocuments(page: number, size: number): Promise<any[]> {
    const targetUrl =
      this.endpoint +
      "dms/document/conflictedDocuments?page=" +
      page +
      "&size=" +
      size;
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

  getmanageConflictedDocuments(
    body,
    page: number,
    size: number,
    sort: string,
    order: string
  ): Promise<any[]> {
    const targetUrl =
      this.endpoint +
      "dms/document/conflictingManagement?page=" +
      page +
      "&size=" +
      size +
      "&sort=" +
      sort +
      order;

    return new Promise((resolve, reject) => {
      this.http
        .post<any>(targetUrl, body, this.getHttpOptions())
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
    request: DocumentSetModel
  ): Promise<DocumentSetModel[]> {
    let targetUrl =
      this.endpoint +
      "dms/documentSet/advanceSearch?page=" +
      page +
      "&size=" +
      size;

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

  scanReread(documentSetId: any, body: any): Promise<FileContradictionModel[]> {
    const targetUrl =
      this.endpoint + "dms/documentSet/reread?documentSetId=" + documentSetId;
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(targetUrl, body, this.getHttpOptions())
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

  ocrProcess(documentSetId: any): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl =
      this.endpoint + "dms/documentSet/" + documentSetId + "/ocr";
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, null, this.getHttpOptions())
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

  stagnateConflictDocument(request): Promise<string> {
    const targetUrl = this.endpoint + "dms/document/toStagnateConflictDocument";
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

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
  }
}
