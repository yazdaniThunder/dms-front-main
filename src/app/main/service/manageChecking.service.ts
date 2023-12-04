import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppSettings } from "../../shared/utils/AppSettings";
import { DocumentSetModel } from "../brnaches/manage-document/document-set.model";
import {
  SetAllConflictModel,
  SetConflictModel,
} from "../documents/manage-checking/set-conflict.model";
import { SetDocConflictModel } from "../documents/manage-checking/set-doc-coflict.model";
import { LoadingService } from "./Loading.service";

@Injectable({ providedIn: "root" })
export class ManageCheckingService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

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

  getBranchConfirmState(
    page: number,
    size: number,
    sort: string,
    order: string
  ): Promise<any[]> {
    const targetUrl =
      this.endpoint +
      "dms/documentSet/branchConfirmed?page=" +
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

  getConflictByType(type, documentSetType): Promise<any[]> {
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

  getConflictOfDocument(): Promise<any[]> {
    const targetUrl =
      this.endpoint + "dms/conflictReason/getAllByType?type=DOCUMENT";
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

  getConflictOfDocumentSet(): Promise<any[]> {
    const targetUrl =
      this.endpoint + "dms/conflictReason/getAllByType?type=DOCUMENT_SET";
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

  notCheckedDocuments(): Promise<any[]> {
    const targetUrl = this.endpoint + "dms/document/notCheckedDocuments";
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

  acceptFile(docId: number): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl =
      this.endpoint + "dms/document/" + docId + "/primaryConfirm";
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

  acceptDocDocument(request): Promise<string> {
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

  deleteDocConflict(id: number): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + `dms/document/${id}/deleteConflicts`;
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

  setConflict(request: SetConflictModel): Promise<any> {
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

  setAllConflict(request: SetAllConflictModel): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/documentSet/setAllConflict";
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

  updateDoc(request: any): Promise<any> {
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

  deleteConflict(id: number): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/document/conflict/" + id;
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

  setDocConflict(request: SetDocConflictModel): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/document/setConflict";
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

  updateConflictDoc(request: any): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/document/conflict";
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
        accept: "*/*",
      }),
    };
  }
}
