import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../shared/utils/AppSettings';
import {LoadingService} from '../../main/service/Loading.service';

@Injectable({providedIn: 'root'})
export class NoteService {

  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(private http: HttpClient,
              private loadingService: LoadingService) {
}

  saveNote(uuId: string, content: string): Promise<string> {
  this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + 'dms/note/add?nodeId=' + uuId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.post<any>(targetUrl, content,  httpOptions)
        .toPromise().then(data => {
        this.loadingService.decreaseLoading();
        resolve(data);
      }, error => {
        this.loadingService.resetLoadingCounter();
        reject(error);
    });
    });
  }


  updateNote(uuId: string, content: string): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + 'dms/note/set?noteId=' + uuId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.put<any>(targetUrl, content,  httpOptions)
        .toPromise().then(data => {
        this.loadingService.decreaseLoading();
        resolve(data);
      }, error => {
        this.loadingService.resetLoadingCounter();
        reject(error);
      });
    });
  }


  getAllNote(uuId: string): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + 'dms/note/list?nodeId=' + uuId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.get<any>(targetUrl,  httpOptions)
        .toPromise().then(data => {
        this.loadingService.decreaseLoading();
        resolve(data);
      }, error => {
        this.loadingService.resetLoadingCounter();
        reject(error);
      });
    });
  }

  deleteNote(uuId: string): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + 'dms/note/delete?noteId=' + uuId;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return new Promise((resolve, reject) => {
      this.http.delete<any>(targetUrl,  httpOptions)
        .toPromise().then(data => {
        this.loadingService.decreaseLoading();
        resolve(data);
      }, error => {
        this.loadingService.resetLoadingCounter();
        reject(error);
      });
    });
  }
}
