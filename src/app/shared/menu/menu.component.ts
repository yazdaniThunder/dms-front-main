import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { ISubscription } from "rxjs-compat/Subscription";
import { CategoryModel } from "../../main/home/category.model";
import { AnimationType } from "../components/carousel/carousel.animations";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  animations: [
    trigger("listAnimation", [
      transition("* => *", [
        // each time the binding value changes

        query(
          ":enter",
          [
            style({ opacity: 0 }),
            stagger(100, [animate("0.5s", style({ opacity: 1 }))]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit, OnDestroy {
  animationType = AnimationType.JackInTheBox;
  public categories: CategoryModel[] = [];
  public categories2: CategoryModel[] = [];
  public categories3: CategoryModel[] = [];
  public categories4: CategoryModel[] = [];
  showSubItem = true;
  showSubItem2 = true;
  showSubItem3 = true;
  showSubItem4 = true;
  display = false;

  roleCheck: string;

  public tabIndex;
  unSubscriber: ISubscription;
  unSubscriberRole: ISubscription;

  public selectedCategory: CategoryModel;

  showDialog() {
    this.display = true;
  }

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.unSubscriberRole = this.authService.getCurrentRole.subscribe(
      (role: string) => {
        if (role != null) {
          this.roleCheck = role;
        } else {
          this.roleCheck = localStorage.getItem("roleName");
        }
      }
    );

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

    this.categories = [
      {
        title: "مدیریت اسناد-ثبت دسته اسناد",
        icon: "fa fa-file",
        id: 1,
        sub: false,
        role: "ALL",
        selected: false,
      },
      {
        title: "مدیریت تائید/عدم تائید",
        icon: "fa fa-check",
        id: 2,
        sub: true,
        role: "BA",
        selected: false,
      },
      {
        title: "مدیریت مغایرت ها",
        icon: "fa fa-ban",
        id: 3,
        sub: false,
        role: "ALL",
        selected: false,
      },
      {
        title: "جستجوی دسته اسناد",
        icon: "fa fa-search",
        id: 9,
        sub: true,
        role: "ALL",
        selected: false,
      },
      {
        title: "مدیریت درخواست و دریافت اسناد",
        icon: "fa fa-file",
        id: 14,
        sub: false,
        role: "ALL",
        selected: false,
      },
      {
        title: "مدیریت درخواست و دریافت اسناد",
        icon: "fa fa-file",
        id: 14,
        sub: false,
        role: "RU",
        selected: false,
      },
    ];

    this.categories2 = [
      {
        title: "مدیریت کاربران",
        icon: "fa fa-file",
        id: 18,
        sub: false,
        role: "ADMIN",
        selected: false,
      },
      {
        title: "اطلاعات پایه",
        icon: "fa fa-file",
        id: 16,
        sub: false,
        role: "DOA",
        selected: false,
      },
      {
        title: "تخصیص واحد های بانک به کاربران اداره اسناد",
        icon: "fa fa-file",
        id: 13,
        sub: false,
        role: "DOA",
        selected: false,
      },
      {
        title: "مدیریت بررسی دسته اسناد",
        icon: "fa fa-file",
        id: 10,
        sub: false,
        role: "ALL",
        selected: false,
      },
      {
        title: "مدیریت بررسی دسته اسناد",
        icon: "fa fa-file",
        id: 10,
        sub: false,
        role: "DOPU",
        selected: false,
      },
      {
        title: "مدیریت اسکن و OCR و بررسی اسناد",
        icon: "fa fa-file",
        id: 6,
        sub: false,
        role: "ALL",
        selected: false,
      },
      {
        title: "مدیریت اسکن و OCR و بررسی اسناد",
        icon: "fa fa-file",
        id: 6,
        sub: false,
        role: "DOEU",
        selected: false,
      },
      {
        title: "مدیریت تائید/عدم تائید فایل سند",
        icon: "fa fa-check",
        id: 11,
        sub: false,
        role: "DOA",
        selected: false,
      },
      {
        title: "مدیریت مغایرت فایل سند",
        icon: "fa fa-ban",
        id: 7,
        sub: false,
        role: "ALL",
        selected: false,
      },
      {
        title: "مدیریت مغایرت فایل سند",
        icon: "fa fa-ban",
        id: 7,
        sub: false,
        role: "DOEU",
        selected: false,
      },
      {
        title: "جستجوی دسته اسناد",
        icon: "fa fa-search",
        id: 17,
        sub: true,
        role: "ALL",
        selected: false,
      },
      {
        title: "جستجوی دسته اسناد",
        icon: "fa fa-search",
        id: 17,
        sub: true,
        role: "DOEU",
        selected: false,
      },
      {
        title: "جستجوی دسته اسناد",
        icon: "fa fa-search",
        id: 17,
        sub: true,
        role: "DOPU",
        selected: false,
      },
      {
        title: "جستجوی فایل سند",
        icon: "fa fa-search",
        id: 12,
        sub: true,
        role: "ALL",
        selected: false,
      },
      {
        title: "جستجوی فایل سند",
        icon: "fa fa-search",
        id: 12,
        sub: true,
        role: "RU",
        selected: false,
      },
      {
        title: "جستجوی فایل سند",
        icon: "fa fa-search",
        id: 12,
        sub: true,
        role: "DOEU",
        selected: false,
      },
      {
        title: "جستجوی فایل سند",
        icon: "fa fa-search",
        id: 12,
        sub: true,
        role: "DOPU",
        selected: false,
      },
      {
        title: "مدیریت ارسال اسناد",
        icon: "fa fa-file",
        id: 15,
        sub: true,
        role: "ALL",
        selected: false,
      },
      {
        title: "مدیریت ارسال اسناد",
        icon: "fa fa-file",
        id: 15,
        sub: true,
        role: "DOPU",
        selected: false,
      },
    ];

    this.categories3 = [
      {
        title: "گزارش دسته اسناد",
        icon: "fa fa-file",
        id: 19,
        sub: false,
        role: "DOPU",
        selected: false,
      },
      {
        title: "گزارش مغایرت فایل/برگ اسناد",
        icon: "fa fa-file",
        id: 20,
        sub: false,
        role: "DOEU",
        selected: false,
      },
    ];
    this.categories4 = [
      {
        title: "ثبت تصاویر مدارک سایر اسناد عملیات بانکی",
        icon: "fa fa-file",
        id: 21,
        sub: false,
        role: "ALL",
        selected: false,
      },
      {
        title: "تایید / عدم تایید تصاویر مدارک سایر اسناد عملیات بانکی",
        icon: "fa fa-file",
        id: 22,
        sub: false,
        role: "BA",
        selected: false,
      },
    ];
  }

  categuriClick(id: number, category: CategoryModel) {
    category.selected = true;

    this.categories.forEach((cat: CategoryModel) => {
      if (cat !== category) {
        cat.selected = false;
      }
    });

    this.categories2.forEach((cat: CategoryModel) => {
      if (cat !== category) {
        cat.selected = false;
      }
    });

    this.categories3.forEach((cat: CategoryModel) => {
      if (cat !== category) {
        cat.selected = false;
      }
    });

    this.categories4.forEach((cat: CategoryModel) => {
      if (cat !== category) {
        cat.selected = false;
      }
    });

    switch (id) {
      case 1:
        {
          this.router.navigate(["main/manage-document"]);
        }
        break;
      case 2:
        {
          this.router.navigate(["main/confirm-package"]);
        }
        break;
      case 3:
        {
          this.router.navigate(["main/manage-contradiction-in-branch"]);
        }
        break;
      case 4:
        {
          this.router.navigate(["main/manage-requests"]);
        }
        break;
      case 5:
        {
          this.router.navigate(["main/manage-receiving"]);
        }
        break;
      case 6:
        {
          this.router.navigate(["main/manage-scanning"]);
        }
        break;
      case 7:
        {
          this.router.navigate(["main/manage-contradiction"]);
        }
        break;
      case 8:
        {
          this.router.navigate(["main/manage-sending"]);
        }
        break;
      case 9:
        {
          this.router.navigate(["main/search-document"]);
        }
        break;
      case 10:
        {
          this.router.navigate(["main/manage-checking"]);
        }
        break;
      case 11:
        {
          this.router.navigate(["main/confirm-documents"]);
        }
        break;
      case 12:
        {
          this.router.navigate(["main/file-search"]);
        }
        break;
      case 13:
        {
          this.router.navigate(["main/branch-assignment"]);
        }
        break;
      case 14:
        {
          this.router.navigate(["main/manage-request-in-branch"]);
        }
        break;
      case 15:
        {
          this.router.navigate(["main/manage-request-document"]);
        }
        break;
      case 16:
        {
          this.router.navigate(["main/basic-information"]);
        }
        break;
      case 17:
        {
          this.router.navigate(["main/search-document-office"]);
        }
        break;
      case 18:
        {
          this.router.navigate(["main/manage-users"]);
        }
        break;
      case 19:
        {
          this.router.navigate(["main/document-set-reports"]);
        }
        break;
      case 20:
        {
          this.router.navigate(["main/document-reports"]);
        }
        break;
      case 21:
        {
          this.router.navigate(["main/add-other-file"]);
        }
        break;
      case 22:
        {
          this.router.navigate(["main/confirm-other-file"]);
        }
        break;
    }
  }

  treeClick() {
    this.router.navigate(["main/tree-directory"]);
  }

  onClickSubItem() {
    this.showSubItem = !this.showSubItem;
  }

  onClickSubItem2() {
    this.showSubItem2 = !this.showSubItem2;
  }

  onClickSubItem3() {
    this.showSubItem3 = !this.showSubItem3;
  }

  onClickSubItem4() {
    this.showSubItem4 = !this.showSubItem4;
  }

  ngOnDestroy(): void {
    this.unSubscriber.unsubscribe();
    this.unSubscriberRole.unsubscribe();
  }
}
