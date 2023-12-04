import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../utils/AppSettings';

@Injectable()
export class HeaderService{
   public typeHead = new BehaviorSubject('Type');
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

   constructor(private http: HttpClient) { }

   setTypeHead(type) {
     this.typeHead.next(type);
   }

  searchInRoots(path: string): Promise<any[]> {
    const targetUrl = this.endpoint + 'dms/search/find?path=' + path;
    const httpOptions = {
    };

    return new Promise((resolve, reject) => {
      this.http.get<any>(targetUrl, httpOptions)
        .toPromise().then(data => {
        resolve(data.queryResult);
      }, error => {
        reject(error);
      });
    });
  }

}
