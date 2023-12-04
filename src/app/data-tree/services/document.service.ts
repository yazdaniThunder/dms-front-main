import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "../../shared/utils/AppSettings";

@Injectable({ providedIn: "root" })
export class DocumentService {
  private endpoint = AppSettings.CUSTOMIZE_API_ENDPOINT;

  constructor(private http: HttpClient) {}

  saveNote(docId: string, dstId: string): Promise<string> {
    const targetUrl =
      this.endpoint + "move?docId=" + docId + "&dstId=" + dstId;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, httpOptions)
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

  getDocContent(docId: string) {
    const url = AppSettings.CUSTOMIZE_API_ENDPOINT;
    const targetUrl = url + "getContent?docId=" + docId;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
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

  getDoc(uuid: string) {
    const targetUrl = this.endpoint + "getChildren?fldId=" + uuid;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
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

  deleteDoc(uuid: string) {
    const targetUrl = this.endpoint + "delete?docId=" + uuid;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
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

  copyDoc(docId: string, dstId: string, name: string) {
    const targetUrl =
      this.endpoint +
      "extendedCopy?docId=" +
      docId +
      "&dstId=" +
      dstId +
      "&name=" +
      name +
      "&categories=true&keywords=true&propertyGroups=true&notes=true&wiki=true";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, null, httpOptions)
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

  moveDoc(docId: string, dstId: string) {
    const targetUrl =
      this.endpoint + "move?docId=" + docId + "&dstId=" + dstId;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, null, httpOptions)
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

  getDocumentByDocUuid(uuid: string) {
    const targetUrl = this.endpoint + uuid;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
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

  getDocumentPropertiesByDocUuid(uuid: string) {
    const targetUrl = this.endpoint + "getMetadata/" + uuid;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
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

  getNodeDocumentUuid(uuid: any): Promise<any> {
    const targetUrl = this.endpoint + uuid;
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
  renameDocument(docId: string, newName: string): Promise<string> {
    const targetUrl =
      this.endpoint + "rename?docId=" + docId + "&newName=" + newName;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };

    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, null, httpOptions)
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
