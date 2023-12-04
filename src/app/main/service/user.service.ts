import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "../../shared/utils/AppSettings";
import {
  ProfileDtoModel,
  UserDtoModel,
  UserModel,
} from "../brnaches/manage-document/user.model";

@Injectable({ providedIn: "root" })
export class UserService {
  private endpoint = AppSettings.DOCUMENTS_ENDPOINT;

  constructor(private http: HttpClient) {}

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



  getConfirmer(): Promise<UserDtoModel[]> {
    const targetUrl = this.endpoint + "dms/user/getConfirmer";
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(targetUrl, null, this.getHttpOptions())
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
  getRegistrar(): Promise<UserDtoModel[]> {
    const targetUrl = this.endpoint + "dms/user/getRegistrar";
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(targetUrl, null, this.getHttpOptions())
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

  getOfficeUsers(obj): Promise<ProfileDtoModel[]> {
    const targetUrl = this.endpoint + "dms/profile/role";
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

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
  }
}
