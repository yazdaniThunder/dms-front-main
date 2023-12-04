import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../shared/services/auth.service";

import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/shared/services/data.service";
import { HeaderService } from "../../shared/services/header.service";

@Component({
  selector: "app-login",
  templateUrl: "login.component.html",
  styleUrls: ["login.component.scss"],
})
export class LoginComponent implements OnInit {
  localStorage: Storage;
  typePass: boolean = false;
  username?: string;
  password?: string;
  isLoading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private change: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private headerService: HeaderService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.change.detectChanges();
    this.localStorage = window.localStorage;
    this.localStorage.setItem("lang", "fa");
    this.headerService.setTypeHead("login");
  }

  nextPage(username: string, passUser: string): void {
    if (username == null || username == "") {
      this.toastr.error("نام کاربری را وارد نمایید", "خطا");
    } else if (passUser == null || passUser == "") {
      this.toastr.error("رمز عبور را وارد نمایید", "خطا");
    } else {
      this.isLoading = true;
      this.authService
        .Login(username, passUser)
        .then((res: any) => {
          this.router.navigate(["main/home"]);
          if (res.profile.role == "BA" || res.profile.role == "BU") {
            this.dataService.updateBadge();
          }
        })
        .catch((err) => {
          if (err.error.message === "The user has been disabled") {
            this.toastr.error("کاربر غیرفعال است", "خطا");
          } else if (err.error.message === "Ldap admin password expired") {
            this.toastr.error("کد (01) معتبر نمیباشد", "خطا");
          } else {
            this.toastr.error("ورود موفقیت آمیز نبود", "خطا");
          }
          this.isLoading = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }

  login(): void {
    this.nextPage(this.username, this.password);
  }

  Type() {
    if (this.typePass) {
      return "text";
    } else {
      return "password";
    }
  }

  getIcon() {
    if (this.typePass) {
      return "../../../assets/icons/eye.svg";
    } else {
      return "../../../assets/icons/eye-closed.svg";
    }
  }

  changeType() {
    this.typePass = !this.typePass;
  }
}
