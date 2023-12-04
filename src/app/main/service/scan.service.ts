import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppSettings } from "../../shared/utils/AppSettings";
import { FileContradictionModel } from "../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { DocumentSetModel } from "../brnaches/manage-document/document-set.model";
import { LoadingService } from "./Loading.service";

@Injectable({ providedIn: "root" })
export class ScanService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}
  upload(documentSetId: number, file): Observable<any> {
    const targetUrl = this.endpoint + "dms/documentSet/scan";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentSetId", documentSetId.toString());
    return this.http.post(targetUrl, formData);
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

  reUpload(documentId: number, file): Observable<any> {
    const targetUrl = this.endpoint + "dms/document/rescan";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentId", documentId.toString());
    return this.http.post(targetUrl, formData);
  }

  reScan(documentSetId: number): Promise<string> {
    const targetUrl = this.endpoint + `dms/documentSet/${documentSetId}/rescan`;
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, this.getHttpOptions())
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

  getPrimaryConfirmed(): Promise<any[]> {
    const targetUrl = this.endpoint + "dms/documentSet/primaryConfirmed";
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

  getScanManagement(
    page: number,
    size: number,
    sort: string,
    order: string
  ): Promise<any[]> {
    const targetUrl =
      this.endpoint +
      "dms/documentSet/scanManagement?page=" +
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

  acceptDocumentSet(request): Promise<string> {
    const targetUrl = this.endpoint + "dms/documentSet/complete";
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

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
  }
}
