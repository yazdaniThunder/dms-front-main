import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { AppSettings } from "../utils/AppSettings";

@Injectable({ providedIn: "root" })
export class AuthService {
  private endpoint: string = AppSettings.DOCUMENTS_ENDPOINT;
  private endpoint2: string = AppSettings.CUSTOMIZE_API_ENDPOINT;

  private currentRole: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.currentRole = new BehaviorSubject(null);
  }

  public get getCurrentRole(): Observable<string> {
    return this.currentRole.asObservable();
  }

  Login(username: string, password: string) {
    localStorage.clear();
    let obj = { username: username, password: password };
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(this.endpoint + "dms/sessions/login", obj)
        .toPromise()
        .then(
          (data) => {
            localStorage.setItem("JWT_TOKEN", data.accessToken);
            localStorage.setItem("branchName", data.profile.branchName);
            localStorage.setItem("branchCode", data.profile.branchCode);
            localStorage.setItem(
              "superVisor",
              data.profile.superVisorName + " - " + data.profile.superVisorCode
            );
            this.currentRole.next(data.profile.role);
            localStorage.setItem("roleName", data.profile.role);
            localStorage.setItem("fullName", data.profile.user.fullName);
            localStorage.setItem("branchId", data.profile.branchId);
            localStorage.setItem("profileId", data.profile.id);
            localStorage.setItem("REFRESH_TOKEN", data.refreshToken);

            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  RefreshToken() {
    const refreshToken = localStorage.getItem("REFRESH_TOKEN");
    localStorage.removeItem("JWT_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");

    return from(
      this.http
        .post<any>(this.endpoint + "dms/sessions/refresh", {
          refreshToken: refreshToken,
        })
        .toPromise()
    ).pipe(
      switchMap((data) => {
        localStorage.setItem("JWT_TOKEN", data.accessToken);
        localStorage.setItem("REFRESH_TOKEN", data.refreshToken);

        return Promise.resolve(data);
      }),
      catchError((error) => {
        return Promise.reject(error);
      })
    );
  }

  getCurrentUser() {
    const jwtStore = localStorage.getItem("JWT_TOKEN");
    if (jwtStore) {
      return jwtStore;
    } else {
      return null;
    }
  }

  getUserRole() {
    const roleStore = localStorage.getItem("roleName");
    if (roleStore) {
      return roleStore;
    } else {
      return null;
    }
  }

  setCurrentUser(token: string): void {
    localStorage.setItem("JWT_TOKEN", token);
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(
          this.endpoint + "dms/sessions/logout",
          "",
          this.getHttpOptions()
        )
        .toPromise()
        .then(
          (data) => {
            localStorage.removeItem("REFRESH_TOKEN");
            localStorage.clear();
            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getBadge() {
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(this.endpoint + "dms/profile/getBadge", this.getHttpOptions())
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

  clearCache() {
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(this.endpoint2 + "cleanup", "", this.getHttpOptions())
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

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        accept: "*/*",
      }),
    };
  }
}
