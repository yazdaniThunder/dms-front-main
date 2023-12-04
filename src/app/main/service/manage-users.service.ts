import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppSettings } from "src/app/shared/utils/AppSettings";
import {
  ProfileDtoModel,
  ProfileSearchDtoModel,
} from "../brnaches/manage-document/user.model";
import { LoadingService } from "./Loading.service";

@Injectable({ providedIn: "root" })
export class ManageUsersService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}
  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
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

  activate(id, active): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl =
      this.endpoint +
      "dms/user/activeAndDeActiveUser?userId=" +
      id +
      "&active=" +
      active;
    return new Promise((resolve, reject) => {
      this.http
        .put<any>(targetUrl, this.getHttpOptions())
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

  getTypeBranchesList(type): Promise<any> {
    const targetUrl = this.endpoint + "dms/branches/getAllByType?type=" + type;
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

  getProfileById(id): Promise<any> {
    const targetUrl = this.endpoint + "dms/profile/getById/" + id;
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

  getAllUsersWithSearch(
    page: number,
    size: number,
    sort: string,
    order: string,
    request: ProfileSearchDtoModel
  ): Promise<ProfileDtoModel[]> {
    const targetUrl =
      this.endpoint +
      "dms/profile/advanceSearch?page=" +
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

  updateUser(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/profile/update";
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

  createUser(request): Promise<string> {
    this.loadingService.trueLoadingCounter();
    const targetUrl = this.endpoint + "dms/profile";
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(targetUrl, request, this.getHttpOptions())
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
}
