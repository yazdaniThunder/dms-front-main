import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AppSettings } from "../utils/AppSettings";

@Injectable({
  providedIn: "root",
})
export class DataService {
  private totalCountSubject = new BehaviorSubject<number>(0);
  private endpoint: string = AppSettings.DOCUMENTS_ENDPOINT;
  roleName: string = "";
  totalCount$ = this.totalCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.roleName = localStorage.getItem("roleName");
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        accept: "*/*",
      }),
    };
  }
  updateBadge() {
      this.http
        .get<any>(this.endpoint + "dms/profile/getBadge", this.getHttpOptions())
        .subscribe(
          (res) => {
            const totalCount = res.totalCount;
            localStorage.setItem("totalCount", totalCount);
            this.totalCountSubject.next(totalCount);
          },
          (error) => {
            console.error("Error fetching badge data", error);
          }
        );
  }
}
