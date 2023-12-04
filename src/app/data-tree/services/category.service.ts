import {Injectable} from '@angular/core';
import {HttpClient,  HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../shared/utils/AppSettings';

@Injectable({providedIn: 'root'})
export class CategoryService {

  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(private http: HttpClient) {
  }

  saveCategory(nodeId: string, catId: string): Promise<string> {
    const targetUrl =
      this.endpoint +
      "dms/property/addCategory?nodeId=" +
      nodeId +
      "&catId=" +
      catId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return new Promise((resolve, reject) => {
      this.http.post<any>(targetUrl, null,  httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
    });
    });
  }

  getAllCategory(): Promise<any> {
    const targetUrl =
      this.endpoint + "dms/folder/getChildren?fldId=/okm:categories";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.get<any>(targetUrl,  httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  deleteCategory(nodeId: string, catId: string): Promise<string> {
    const targetUrl =
      this.endpoint +
      "dms/property/deleteCategory?nodeId=" +
      nodeId +
      "&catId=" +
      catId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.delete<any>(targetUrl,  httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
