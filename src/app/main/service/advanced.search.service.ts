import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppSettings} from '../../shared/utils/AppSettings';
import {SearchResponseModel} from '../../data-tree/models/search-response.model';
import {LoadingService} from './Loading.service';

@Injectable({providedIn: 'root'})
export class AdvancedSearch {

  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;


  constructor(private http: HttpClient,
              private loadingService: LoadingService) {
  }

  callApiAdvancedSearch(TextBox: string, /* Category: string , DocCode: string , AccountCode: string ,
                         BranchCode: string, CustomerCode: string */
                        searchFromDate: string, searchToDate: string): Promise<SearchResponseModel[]> {
    this.loadingService.trueLoadingCounter();
    let targetUrl = this.endpoint + 'dms/search/find?';
    if (TextBox !== undefined && TextBox !== ' ' && TextBox !== '') {
      targetUrl = targetUrl + 'name=' + TextBox + '&';
    }
    if (searchFromDate !== undefined && searchFromDate !== '0') {
      targetUrl = targetUrl + 'lastModifiedFrom=' + searchFromDate + '&';
    }
    if (searchToDate !== undefined && searchToDate !== '0') {
      targetUrl = targetUrl + 'lastModifiedTo=' + searchToDate;
    }
    /*'?category=' + Category + '?name' + DocCode + '?name' + AccountCode + '?name=' + BranchCode
       + '?name=' + CustomerCode*/
    const httpOptions = {
 
    };

    return new Promise((resolve, reject) => {
      this.http.get<any>(targetUrl, httpOptions)
        .toPromise().then(data => {
          this.loadingService.decreaseLoading();
          resolve(data.queryResult);

      }, error => {
         this.loadingService.resetLoadingCounter();
         reject(error);
      });
    });
  }

}
