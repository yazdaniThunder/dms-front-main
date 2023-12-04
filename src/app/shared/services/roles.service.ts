import { Injectable } from "@angular/core";

const appRoles = localStorage.getItem("roleName");

@Injectable({ providedIn: "root" })
export class RolesService {

  hasRole(role: string): boolean {
    return appRoles.indexOf(role) > -1;
  }
}
