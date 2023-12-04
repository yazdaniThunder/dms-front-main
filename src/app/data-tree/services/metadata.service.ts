import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../shared/utils/AppSettings';

@Injectable({providedIn: 'root'})
export class MetadataService {

  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;
  private documentEndpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(private http: HttpClient) {
  }

  saveGroup(body: any): Promise<string> {
    const targetUrl = this.documentEndpoint + 'api/nodeDocuments/setMetadata';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return new Promise((resolve, reject) => {
      this.http.post<any>(targetUrl, body, httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getFixedMetadata(): Promise<any> {
    const targetUrl = this.documentEndpoint + 'dms/metadata';
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

  getMetadataById(nodeId: string): Promise<any> {
    const targetUrl = this.documentEndpoint + 'api/nodeDocuments/metadata/' + nodeId;
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

  getMetadataSimple(nodeId: string, grpName: string): Promise<any> {
    const targetUrl =
      this.endpoint +
      "dms/propertyGroup/getPropertiesSimple?nodeId=" +
      nodeId +
      "&grpName=" +
      grpName;
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

  deleteMetaData(nodeId: string, catId: string): Promise<string> {
    const targetUrl =
      this.endpoint +
      "dms/propertyGroup/removeGroup?nodeId=" +
      nodeId +
      "&grpName=" +
      catId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.delete<any>(targetUrl, httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getAllMetadata() {
    const targetUrl = this.documentEndpoint + 'api/nodeDocuments/metadata';
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

  getAllDocumentTypes(page: number, size: number): Promise<any[]> {
    const targetUrl =
      this.documentEndpoint +
      "dms/documentType?page=" +
      page +
      "&size=" +
      size +
      "&sort=title,asc";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
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
