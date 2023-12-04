import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../shared/utils/AppSettings';

@Injectable({providedIn: 'root'})

export class FolderService {

  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(private http: HttpClient) {
  }

  copyFolder(fldId: string, dstId: string): Promise<string> {
    const targetUrl =
      this.endpoint + "dms/folder/copy?fldId=" + fldId + "&dstId=" + dstId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return new Promise((resolve, reject) => {
      this.http.put<any>(targetUrl, null,  httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  moveFolder(fldId: string, dstId: string): Promise<any> {
    const targetUrl =
      this.endpoint + +"dms/folder/move?fldId=" + fldId + "&dstId=" + dstId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.put<any>(targetUrl,  httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  deleteFolder(fldId: string): Promise<string> {
    const targetUrl = this.endpoint + "dms/folder/delete?fldId=" + fldId; ;
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

  createFolder(createFolderBody: any): Promise<string> {
    const targetUrl = this.endpoint + "dms/folder/createSimple"; ;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.post<any>(targetUrl, createFolderBody,  httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  renameFolder(fldId: string, newName: string): Promise<string> {
    const targetUrl =
      this.endpoint +
      "dms/folder/rename?fldId=" +
      fldId +
      "&newName=" +
      newName; ;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.put<any>(targetUrl,  null, httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

}
