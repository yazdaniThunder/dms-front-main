import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppSettings } from "../../shared/utils/AppSettings";
import { FileContradictionModel } from "../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { FixConflictModel } from "../brnaches/manage-contradiction-in-branch/fix-conflict.model";
import { DocumentSetModel } from "../brnaches/manage-document/document-set.model";
import { LoadingService } from "./Loading.service";

@Injectable({ providedIn: "root" })
export class ManageFileService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;
  private endpoint2 = AppSettings.CUSTOMIZE_API_ENDPOINT;

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

  upload(documentSetId, file): Observable<any> {
    const targetUrl =
      this.endpoint +
      "dms/documentSet/uploadFile?documentSetId=" +
      documentSetId;
    const formData = new FormData();
    formData.append("file", file);
    return this.http.put(targetUrl, formData);
  }

  uploadEdit(id, uuid, content): Observable<any> {
    const targetUrl =
      this.endpoint + "dms/document/updateDocument?documentSetId=" + id;
    const formData = new FormData();
    formData.append("content", content);
    formData.append("uuid", uuid);

    return this.http.post(targetUrl, formData);
  }

  getAllContradictionFileSet(
    page: number,
    size: number,
    sort: string,
    order: string
  ): Promise<any[]> {
    const targetUrl =
      this.endpoint +
      "dms/document/sentConflictedDocument?page=" +
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

  getAllDocumentTypes(page: number, size: number): Promise<any[]> {
    const targetUrl =
      this.endpoint +
      "dms/documentType?page=" +
      page +
      "&size=" +
      size +
      "&sort=title,asc";
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

  getAllDocumentTypesList(): Promise<any[]> {
    const targetUrl = this.endpoint + "dms/documentType/getAllDocumentTypes";
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

  updateDocument(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/document";
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

  updateMetaData(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint2 + "setMetadata";
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

  primaryConfirm(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/document/primaryConfirm";
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

  fixConflictDocument(request: FixConflictModel): Promise<any> {
    const targetUrl = this.endpoint + "dms/document/fixConflict";
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

  getDocumentById(id: number): Promise<FileContradictionModel> {
    const targetUrl = this.endpoint + `dms/document/${id}`;
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

  getFileSetById(id: number): Promise<FileContradictionModel> {
    const targetUrl = this.endpoint + `dms/documentSet/${id}`;
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

  getByDocumentState(
    id: number,
    state: string
  ): Promise<any[]> {
    const targetUrl =
      this.endpoint +
      `dms/document/getAllByDocumentState?documentSetId=${id}&state=${state}`;
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

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
  }
}
