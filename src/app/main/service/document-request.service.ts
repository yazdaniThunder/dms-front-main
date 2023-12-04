import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppSettings } from "../../shared/utils/AppSettings";
import { DocumentSetModel } from "../brnaches/manage-document/document-set.model";
import { SearchRequestModel } from "../brnaches/search-request-sent/search-request.model";

@Injectable({ providedIn: "root" })
export class DocumentRequestService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;
  private endpoint2 = AppSettings.CUSTOMIZE_API_ENDPOINT;

  constructor(private http: HttpClient) {}

  getAllBranches(page: number, size: number): Promise<any> {
    const targetUrl =
      this.endpoint +
      "dms/branches?page=" +
      page +
      "&size=" +
      size +
      "&sort=branchName,ASC";
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

  uploadEdit(uuid, content, requestId): Observable<any> {
    const targetUrl = this.endpoint + "dms/documentRequest/updateDocument";
    const formData = new FormData();
    formData.append("content", content);
    formData.append("uuid", uuid);
    formData.append("requestId", requestId);

    return this.http.post(targetUrl, formData);
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

  getAllReasonList(): Promise<any> {
    const targetUrl = this.endpoint + "dms/documentRequestReason/getAllList";
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

  public getDataContent(id: string) {
    const targetUrl = this.endpoint2 + `${id}`;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("JWT_TOKEN"),
      }),
    };
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(targetUrl, httpOptions)
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

  getPath(uuId): Promise<any> {
    const url = this.endpoint2 + "getPath/" + uuId;
    return new Promise((resolve, reject) => {
      var blobObservable = this.http.get(url, {
        responseType: "text",
      });
      blobObservable.toPromise().then(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  save(documentReuqest: any): Promise<any> {
    const targetUrl = this.endpoint + "dms/documentRequest";
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("JWT_TOKEN"),
      }),
    };
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(targetUrl, documentReuqest, httpOptions)
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
        // Authorization: "Basic " + localStorage.getItem("JWT_TOKEN"),
      }),
    };
  }

  getAllDocumentRequest(
    page: number,
    size: number,
    sort: string,
    order: string,
    body: any
  ): Promise<any> {
    const targetUrl =
      this.endpoint +
      "dms/documentRequest/branchSearch?page=" +
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

  getAllDocumentRequestWithSearch(
    page: number,
    size: number,
    sort: string,
    order: string,
    request: SearchRequestModel
  ): Promise<DocumentSetModel[]> {
    const targetUrl =
      this.endpoint +
      "dms/documentRequest/search?page=" +
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
    const targetUrl = this.endpoint + "dms/documentRequest/" + id;

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

  acceptRequest(request?: any) {
    let targetUrl = this.endpoint + "dms/documentRequest/complete";

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

  branchOperation(body: any) {
    let targetUrl = this.endpoint + "dms/documentRequest/branchComplete";

    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, body, this.getHttpOptions())
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

  getReciveBranch(id: number): Promise<any> {
    const targetUrl = this.endpoint + "dms/documentRequest/receive/" + id;
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


  sendDocumentToBranch(documentRequest: any): Promise<any> {
    const targetUrl = this.endpoint + "dms/documentRequest/send";
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, documentRequest, this.getHttpOptions())
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

  editExpireDate(request: any) {
    let targetUrl = this.endpoint + "dms/documentRequest/updateExpiryDate";

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
}
