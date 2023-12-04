import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth.service";

@Component({
  selector: "app-forbidden-page",
  templateUrl: "./forbidden-page.component.html",
  styleUrls: ["./forbidden-page.component.scss"],
})
export class ForbiddenPageComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  logout() {
    this.authService.logout();
    this.router.navigate(["register/login"]);
  }
}
