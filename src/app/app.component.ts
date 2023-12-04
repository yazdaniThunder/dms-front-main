import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { ISubscription } from "rxjs-compat/Subscription";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  subscription: ISubscription;
  navFixed = false;
  isMobileSize = false;
  localStorage: Storage;
  showReload = false;
  href = "";
  showMenu = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes("/main")) {
          this.showMenu = true;
        } else {
          this.showMenu = false;
        }
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      }
    });

    if (window.innerWidth < 1050) {
      this.isMobileSize = true;
    } else {
      this.isMobileSize = false;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth < 900) {
      this.isMobileSize = true;
    } else {
      this.isMobileSize = false;
    }
  }
}
