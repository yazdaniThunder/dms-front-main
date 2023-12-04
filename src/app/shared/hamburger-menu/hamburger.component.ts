import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {NavigationEnd, Router} from '@angular/router';
import {ISubscription} from 'rxjs-compat/Subscription';

declare var require: any;


@Component({
  selector: 'app-hamburger',
  templateUrl: './hamburger.component.html',
  styleUrls: ['./hamburger.component.scss']
})
export class HamburgerComponent implements OnInit {

  display = false;
  items: MenuItem[] = [];
  check = 2;
  userMenu: any;
  position = 'right';
  localStorage: Storage;
  public tabIndex;
  unSubscriber: ISubscription;


  constructor(private router: Router) {
  }

  ngOnInit() {
    this.localStorage = window.localStorage;

    let newMenu: any;

    this.unSubscriber = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          event.url.includes("/tree-directory") ||
          event.url.includes("/bookmark")
        ) {
          this.tabIndex = 0;
        } else {
          this.tabIndex = 1;
        }
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      }
    });

    this.userMenu = require('./private-menu-json/user-private-menu.json');

    newMenu = this.userMenu as any;
    this.items = newMenu.map(item => this.getMenuItems(item));

  }

  private getMenuItems(item: any): MenuItem {
    let menuItem: MenuItem = Object.assign({}, item);
    if (menuItem.routerLink) {
      menuItem = Object.assign(menuItem, {
        command: (event) => {
          this.display = false;
        }
      });
    }
    if (menuItem.items) {
      menuItem.items = (menuItem.items as Array<MenuItem>).map(x => this.getMenuItems(x));
    }
    return menuItem;
  }

  closeClick() {
  }
  clickButton(event) {
    this.display = true;
  }
}
