import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { AppSettings } from "../../shared/utils/AppSettings";
import { DocumentContradictionModel } from "../brnaches/manage-contradiction-in-branch/document-contradiction.model";
import { DocumentFixConflictModel } from "../brnaches/manage-document/document-fix-conflict.model";
import { DocumentSetCompleteModel } from "../brnaches/manage-document/document-set-complete.model";
import { DocumentSetConflictModel } from "../brnaches/manage-document/document-set-conflict.model";
import { DocumentSetModel } from "../brnaches/manage-document/document-set.model";
import { LoadingService } from "./Loading.service";

@Injectable({ providedIn: "root" })
export class ManageDocumentService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;
  private endpoint2 = AppSettings.CUSTOMIZE_API_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {}

  createDocumentSet(request: DocumentSetModel): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/documentSet";
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

  getConflictOfDocument(type, documentSetType): Promise<any[]> {
    const targetUrl =
      this.endpoint +
      "dms/conflictReason/getByDocumentSetType?type=" +
      type +
      "&documentSetType=" +
      documentSetType;
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

  updateDocumentSet(request: DocumentSetModel): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/documentSet";
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

  getAllDocumentSet(
    page: number,
    size: number,
    sort: string,
    order: string
  ): Promise<any> {
    const targetUrl =
      this.endpoint +
      "dms/documentSet/documentSetByBranch?page=" +
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

  getAllDocument(page: number, size: number): Promise<any> {
    const targetUrl =
      this.endpoint + "dms/document?page=" + page + "&size=" + size;

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

  getAllDocumentSetWithSearch(
    page: number,
    size: number,
    sort: string,
    order: string,
    request: DocumentSetModel
  ): Promise<DocumentSetModel[]> {
    const targetUrl =
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

  getAcceptWaitingDoc(): Promise<DocumentSetModel[]> {
    const targetUrl = this.endpoint + "dms/documentSet/acceptWaiting";
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(targetUrl, this.getHttpOptions())
        .toPromise()
        .then(
          (data) => {
            resolve(data.content);
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

  deleteDocumentSetById(uuIds: number[]): Promise<any> {
    const targetUrl = this.endpoint + "dms/documentSet";
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

  setConflictDocumentSet(request: DocumentSetConflictModel): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/documentSet/setConflict";
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

  fixConflictDocumentSet(request: DocumentFixConflictModel): Promise<any> {
    const targetUrl = this.endpoint + "dms/documentSet/fixConflict";
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

  completeConflictDocumentSet(
    documentId: number,
    operation: string
  ): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl =
      this.endpoint +
      `dms/document/${documentId}/complete?operation=${operation}`;
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

  getAllContradictionDocumentSet(
    page: number,
    size: number,
    sort: string,
    order: string
  ): Promise<DocumentContradictionModel[]> {
    const targetUrl =
      this.endpoint +
      "dms/documentSet/conflicting?page=" +
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

  getExcelDocumentSetById(request: any): Observable<Blob> {
    const targetUrl = this.endpoint + "dms/documentSet/excel";

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

  getExcelDocumentById(request: any): Observable<Blob> {
    const targetUrl = this.endpoint + "dms/document/excel";

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
  getSequence(): Promise<any> {
    const targetUrl = this.endpoint + "dms/branches/getSequence";

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

  completeDocumentSet(request: DocumentSetCompleteModel): Promise<string> {
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

  getAllTransaction(page: number, size: number): Promise<any[]> {
    const targetUrl =
      this.endpoint + "dms/transaction?page=" + page + "&size=" + size;
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

  getFileTypeByEnum(name: any): Promise<any> {
    const targetUrl = this.endpoint + "dms/fileType/getByTitle?title=" + name;
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
