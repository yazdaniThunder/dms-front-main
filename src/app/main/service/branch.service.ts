import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppSettings } from "../../shared/utils/AppSettings";
import {
  ProfileDtoModel,
  UserModel,
} from "../brnaches/manage-document/user.model";
import { LoadingService } from "./Loading.service";

@Injectable({ providedIn: "root" })
export class BranchService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  updateBranches(branches: any): Promise<any> {
    const targetUrl = this.endpoint + `dms/branches/update`;
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, branches, this.getHttpOptions())
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

  getAllWithSearch(
    page: number,
    size: number,
    sort: string,
    order: string,
    request: any
  ): Promise<any> {
    const targetUrl =
      this.endpoint +
      "dms/branches/getBranchWithProfile?page=" +
      page +
      "&size=" +
      size +
      "&sort=" +
      sort +
      order;

    return new Promise((resolve, reject) => {
      this.http
        .post<any>(targetUrl, request, this.getHttpOptions())
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

  getAllBranchesList(): Promise<any> {
    const targetUrl = this.endpoint + "dms/branches/getAllBranch";
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(targetUrl, this.getHttpOptions())
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

  getBranchSearch(id: number): Promise<any> {
    const targetUrl = this.endpoint + "dms/branches/" + id;
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(targetUrl, this.getHttpOptions())
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

  getUserSearch(id: number): Promise<any> {
    const targetUrl = this.endpoint + "dms/branches/profile/" + id;
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(targetUrl, this.getHttpOptions())
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

  getAllUsers(page: number, size: number): Promise<UserModel[]> {
    const targetUrl =
      this.endpoint +
      "dms/user?page=" +
      page +
      "&size=" +
      size +
      "&sort=lastName,ASC";
    return new Promise((resolve, reject) => {
      this.http
        .get<any>(targetUrl, this.getHttpOptions())
        .toPromise()
        .then(
          (data) => {
            resolve(data.content);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  getOfficeUsers(): Promise<ProfileDtoModel[]> {
    const targetUrl = this.endpoint + "dms/profile/role";
    let obj = ["DOEU", "DOPU"];
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(targetUrl, obj, this.getHttpOptions())
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

  assignBranch(id: number, request): Promise<any> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + `dms/user/${id}/assignBranch`;
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, request, this.getHttpOptions())
        .toPromise()
        .then(
          (data) => {
            this.loadingService.decreaseLoading();
            resolve(data);
          },
          (error) => {
            this.loadingService.resetLoadingCounter();
            reject(error);
          }
        );
    });
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
  }
}
