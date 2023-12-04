import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "../utils/AppSettings";
import { DocumentModel } from "../../data-tree/models/Document.model";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  // API url
  url: string;
  private endpoint = AppSettings.CUSTOMIZE_API_ENDPOINT;
  constructor(private http: HttpClient) {}

  // // Returns an observable
  // upload(file: File, nodeId): Observable<any> {
  //   this.url = AppSettings.BASE_API_ENDPOINT + "document/create";

  //   // Create form data
  //   const formData = new FormData();

  //   // Store form name as "file" with file data
  //   formData.append("file", file, file.name);

  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //     }),
  //   };

  //   // Make http post request over api
  //   // with formData as req
  //   return this.http.post(this.url, formData, httpOptions);
  // }

  uploadAndProgressSingle(file: File, path: string) {
    const formData = new FormData();
    formData.append("content", file);
    formData.append("docPath", path + "/" + file.name);

    return new Promise((resolve, reject) => {
      return this.http
        .post<any>(this.endpoint + "createSimple", formData)
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

  checkIn(file: File, path: string) {
    this.url = this.endpoint + "checkin";
    const formData = new FormData();
    formData.append("docId", path);
    formData.append("content", file);
    formData.append("comment", "test");
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     "Content-Type": "multipart/form-data",
    //   }),
    // };
    return this.http.post<any>(this.url, formData).pipe();
  }

  checkOut(docId: string): Promise<any> {
    const targetUrl = this.endpoint + "checkout?docId=" + docId;
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
}
