import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppSettings } from "src/app/shared/utils/AppSettings";
import { DocumentSetModel } from "../brnaches/manage-document/document-set.model";
import { SearchRequestModel } from "../brnaches/search-request-sent/search-request.model";

@Injectable({ providedIn: "root" })
export class RequestInDocService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;
  private endpoint2 = AppSettings.CUSTOMIZE_API_ENDPOINT;

  constructor(private http: HttpClient) {}
  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
  }

  documentOperation(body: any) {
    let targetUrl = this.endpoint + "dms/documentRequest/officeComplete";

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

  acceptRequest(request): Promise<string> {
    const targetUrl = this.endpoint + "dms/documentRequest/complete";
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

  getAllDocumentRequest(
    page: number,
    size: number,
    sort: string,
    order: string,
    body: any
  ): Promise<any> {
    const targetUrl =
      this.endpoint +
      "dms/documentRequest/documentOfficeSearch?page=" +
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

  getAllRequestBranches(): Promise<any> {
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

  // upload(requestId: number, file, description): Observable<any> {
  //   const targetUrl = this.endpoint + "dms/documentRequest/uploadFile";
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("requestId", requestId.toString());
  //   formData.append("description", description);

  //   return this.http.post(targetUrl, formData);
  // }

  upload(formData: FormData): Observable<any> {
    const targetUrl = this.endpoint + "dms/documentRequest/uploadFile";
    return this.http.post(targetUrl, formData);
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
}
