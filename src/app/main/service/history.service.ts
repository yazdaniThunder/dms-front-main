import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../shared/utils/AppSettings';

@Injectable({providedIn: 'root'})

export class HistoryService {

  private endpoint = AppSettings.CUSTOMIZE_API_ENDPOINT;

  constructor(private http: HttpClient) {
  }

  GetVersionHistory(docId: string): Promise<any> {
    const targetUrl = this.endpoint + 'getVersionHistory?docId=' + docId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return new Promise((resolve, reject) => {
      this.http.get<any>(targetUrl, httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }



  RestoreVersion(docId: string, versionId: any): Promise<any> {
    const targetUrl = this.endpoint + 'restoreVersion?docId=' + docId + '&versionId=' + versionId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.put<any>(targetUrl, null ,  httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  PurgeVersion(docId: string): Promise<any> {
    const targetUrl = this.endpoint +  'purgeVersionHistory?docId=' + docId ;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.put<any>(targetUrl, null ,  httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }



}
