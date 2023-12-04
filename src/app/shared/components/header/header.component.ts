import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { ISubscription } from "rxjs-compat/Subscription";
import { catchError, debounceTime, distinctUntilChanged } from "rxjs/operators";
import swal from "sweetalert2";
import { NodeModel } from "../../../data-tree/models/node.model";
import { AuthService } from "../../services/auth.service";
import { DataService } from "../../services/data.service";
import { HeaderService } from "../../services/header.service";
import { AppSettings } from "../../utils/AppSettings";
import { RoleTypeEnum } from "../profile-user-modal/role.model";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  showItems = false;
  uploadShow = false;
  exitShow = true;
  queryField: FormControl = new FormControl();
  item: string;
  searchItems: NodeModel[] = [];
  unsubscribe: ISubscription;
  unSubscriberRouter: ISubscription;
  private endpoint = AppSettings.CUSTOMIZE_API_ENDPOINT;
  isMobileSize = false;
  roleName: any;
  totalCount: any = "";

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private toastr: ToastrService,
    private http: HttpClient,
    private modalService: NgbModal,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentPath = event.url;
        if (currentPath === "/" || currentPath === "register/login") {
          this.showItems = false;
        }
      }
    });
    this.headerService.typeHead.subscribe((check) => {
      if (check === "upload") {
        this.uploadShow = true;
        this.exitShow = true;
      } else if (check === "login") {
        this.uploadShow = false;
        this.exitShow = false;
      } else {
        this.uploadShow = false;
        this.exitShow = true;
      }
    });
    this.unsubscribe = this.queryField.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        if (value && value !== "") {
          this.searchItems = [];
        }
      });

    this.unSubscriberRouter = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes("/login") || event.url === "/") {
          this.showItems = false;
        } else {
          this.showItems = true;
          this.dataService.totalCount$.subscribe((totalCount) => {
            this.totalCount = totalCount;
          });
          this.roleName = localStorage.getItem("roleName");
          if (this.roleName === "BA" || this.roleName === "BU") {
            const storedTotalCount = localStorage.getItem("totalCount");
            if (storedTotalCount) {
              this.totalCount = parseInt(storedTotalCount, 10);
            }
          }
        }
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      }
    });

    if (window.innerWidth < 900) {
      this.isMobileSize = true;
    } else {
      this.isMobileSize = false;
    }
  }
  searchNodes(event) {
    this.ngbModalRef.close();
  }

  getType(type: RoleTypeEnum) {
    return RoleTypeEnum[type];
  }
  openModalClick(content) {
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }

  checkFileIcon(path: string) {
    const split = path.split("/", 10);
    const title = split[split.length - 1];
    if (title.substr(title.length - 4) === "docx") {
      return "fa word-small  fa-file-word-o";
    } else if (title.substr(title.length - 4) === "xlsx") {
      return "fa excel-small fa-file-excel-o";
    } else if (title.substr(title.length - 3) === "pdf") {
      return "fa pdf-small fa-file-pdf-o";
    } else if (
      title.substr(title.length - 3) === "PNG" ||
      title.substr(title.length - 3) === "jpg"
    ) {
      return "fa image-small fa-file-image-o";
    } else if (title.substr(title.length - 3) === "txt") {
      return "fa txt-small fa-file-text-o";
    } else {
      return "fa file-small fa-file";
    }
  }

  upload(files: File[]) {
    // pick from one of the 4 styles of file uploads below
    this.uploadAndProgressSingle(files[0]);
  }

  uploadAndProgressSingle(file: File) {
    const formData = new FormData();
    formData.append("content", file);
    formData.append("docPath", "/okm:root/copy/" + file.name);
    const httpOptions = {};

    this.http
      .post<any>(this.endpoint + "createSimple", formData, httpOptions)
      .pipe(catchError(this.handleError))
      .subscribe((data) => {
        this.toastr.success("فایل با موفقیت آپلود شد", "");
        window.history.back();
      });
  }

  private handleError(error: HttpErrorResponse) {
    alert("خطا" + " " + error.status + " " + " فایل آپلود شده وجود دارد");
    return null;
  }

  goToHome() {
    this.router.navigate(["main/home"]);
  }

  bookmark() {
    this.router.navigate(["main/bookmark-directory"]).then((r) => null);
  }

  goToLogin() {
    this.showItems = false;
    localStorage.clear();
    this.router.navigate(["register/login"]);
  }

  logout() {
    this.authService.logout();

    this.router.navigate(["register/login"]);
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        accept: "*/*",
      }),
    };
  }

  goToTree() {
    this.router.navigate(["main/tree-directory"]);
  }

  goToDetail(result: NodeModel) {}

  ngOnDestroy(): void {
    this.unsubscribe.unsubscribe();
  }

  closeitem() {
    this.searchItems = [];
    this.item = "";
  }

  clearCache() {
    swal
      .fire({
        title: "آیا از پاکسازی کش سیستم اطمینان دارید؟",
        text: "!شما قادر به برگرداندن موارد پاک شده نخواهید بود",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله پاکسازی کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.authService.clearCache().then(() => {
            this.toastr.success("پاکسازی فایل ها با موفقیت انجام شد.");
          });
        }
      })
      .catch((err) => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }
}
