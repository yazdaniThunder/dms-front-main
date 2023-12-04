import {Injectable} from '@angular/core';


@Injectable({providedIn: 'root'})
export class LoadingService {

  loadingCounter = 0;

  trueLoadingCounter() {
    this.loadingCounter ++;
  }

  decreaseLoading() {
    this.loadingCounter --;
  }

  resetLoadingCounter() {
    this.loadingCounter = 0;
  }
}
