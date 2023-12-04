import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../shared/utils/AppSettings';
import {LoadingService} from '../../main/service/Loading.service';

@Injectable({providedIn: 'root'})
export class BookmarkService {

  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(private http: HttpClient,
              private loadingService: LoadingService) {
  }

  saveBookmark(uuId: string, name: string): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + 'dms/bookmark/create?nodeId=' + uuId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return new Promise((resolve, reject) => {
      this.http.post<any>(targetUrl, name,  httpOptions)
        .toPromise().then(data => {
        this.loadingService.decreaseLoading();
        resolve(data);
      }, error => {
        this.loadingService.resetLoadingCounter();
        reject(error);
    });
    });
  }


  updateBookmark(uuId: string, content: string): Promise<string> {
    const targetUrl = this.endpoint + 'dms/bookmark/rename?bookmarkId=' + uuId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.put<any>(targetUrl, content,  httpOptions)
        .toPromise().then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  getAllBookmark(): Promise<any> {
    const targetUrl = this.endpoint + 'dms/bookmark/getAll';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.get<any>(targetUrl,  httpOptions)
        .toPromise().then(res => {
        resolve(res);
      }, error => {
        reject(error);
      });
    });
  }

  deleteBookmark(uuId: string): Promise<string> {
    const targetUrl = this.endpoint + 'dms/bookmark/delete?bookmarkId=' + uuId;
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



  getBookmarkById(uuId: string): Promise<string> {
    const targetUrl = this.endpoint + 'dms/bookmark/get?bookmarkId=' + uuId;
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
}
