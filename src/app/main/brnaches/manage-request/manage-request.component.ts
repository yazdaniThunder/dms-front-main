import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { finalize } from "rxjs/operators";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { BranchDtoModel } from "../../documents/assign-branch/branch.model";
import { DocumentRequestService } from "../../service/document-request.service";
import { UserService } from "../../service/user.service";
import { FileContradictionModel } from "../manage-contradiction-in-branch/file-contradiction.model";
import { RequestState } from "../manage-document/document-set-state.enum";
import { DocumentSetRequestTypeEnum } from "../manage-document/document-set-type.enum";
import { UserModel } from "../manage-document/user.model";
import { RequestTypeAdmin } from "../request-modal/request-modal.component";
import { SearchRequestModel } from "../search-request-sent/search-request.model";
import { StatesModel } from "./states.model";

@Component({
  selector: "app-manage-request",
  templateUrl: "./manage-request.component.html",
  styleUrls: ["./manage-request.component.scss"],
})
export class ManageRequestComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  typeKeys = Object.keys(DocumentSetRequestTypeEnum).map((key) => ({
    label: DocumentSetRequestTypeEnum[key],
    value: key,
  }));
  stateKeys = Object.keys(RequestState).map((key) => ({
    label: RequestState[key],
    value: key,
  }));
  fileContradictionModel: FileContradictionModel[];
  documentData: FileContradictionModel[];
  selectedFiles: FileContradictionModel[] = [];
  selectedFile: FileContradictionModel;
  panelOpenState = false;
  branchName: string = "";
  userList: UserModel[];
  userList2: UserModel[];
  documentSearchDto: SearchRequestModel = {};
  resultCount: number = 0;
  page: number = 0;
  isSearch: boolean = false;
  ordering: string = ",desc";
  typeBranchKeys: any[] = [];
  description: string = "";
  imageURL: SafeUrl;
  isLoading: boolean = false;
  content: any;
  open: boolean = false;
  states: StatesModel[];
  roleCheck: string;

  branchContentDropDown: BranchDtoModel[];

  isFirstLoad: boolean = true;

  currentPage: number;

  typeLabel: any = "";
  user2Label: any = "";
  userLabel: any = "";
  branchLabel: any = "";
  stateLabel: any = "";
  typeBranchLabel: any = "";

  constructor(
    private documentRequestService: DocumentRequestService,
    private persianCalendarService: PersianCalendarService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.roleCheck = localStorage.getItem("roleName");

    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
    this.getAllUsers();
    this.getAllBranch();
    this.formGroup = this.formBuilder.group({
      registerDateFrom: new FormControl(""),
      registerDateTo: new FormControl(""),
      documentNumber: new FormControl(""),
      documentDateFrom: new FormControl(""),
      documentDateTo: new FormControl(""),
      customerNumber: new FormControl(""),
      documentType: new FormControl(""),
      state: new FormControl(""),
      creatorId: new FormControl(""),
      confirmerId: new FormControl(""),
      documentBranchIds: new FormControl(""),
      requestBranchIds: new FormControl(""),
      sentDateFrom: new FormControl(""),
      sentDateTo: new FormControl(""),
    });
  }
  //
  getAllUsers() {
    this.userService
      .getConfirmer()
      .then((res) => {
        this.userList = res;
        if (this.userList.length > 0) {
          this.userList.forEach(
            (item) => (item.fullName = item.firstName + " " + item.lastName)
          );
        }
        this.onPageChangeUser({ first: 0, rows: this.itemsPerPage });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
    this.userService
      .getRegistrar()
      .then((res) => {
        this.userList2 = res;
        if (this.userList2.length > 0) {
          this.userList2.forEach(
            (item) => (item.fullName = item.firstName + " " + item.lastName)
          );
        }
        this.onPageChangeUser2({ first: 0, rows: this.itemsPerPage });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  currentPageItemsUser: any[] = [];
  itemsPerPage = 1500; // Number of items to display per page

  onPageChangeUser(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItemsUser = this.userList.slice(startIndex, endIndex);
  }

  currentPageItemsUser2: any[] = [];

  onPageChangeUser2(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItemsUser2 = this.userList2.slice(startIndex, endIndex);
  }

  currentPageItemsBranch: any[] = [];

  onPageChangeBranch(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItemsBranch = this.typeBranchKeys.slice(
      startIndex,
      endIndex
    );
  }

  getAllBranch() {
    this.documentRequestService
      .getAllBranchesList()
      .then((res: any) => {
        this.branchContentDropDown = res;
        this.branchContentDropDown.forEach((k) => {
          this.typeBranchKeys.push({
            label: k.branchName + "-" + k.branchCode,
            value: k.id,
          });
        });
        this.onPageChangeBranch({ first: 0, rows: this.itemsPerPage });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  setBranch(event: any) {
    this.documentSearchDto.documentBranchIds = [event.value];
    this.typeBranchKeys = event.label;
    this.typeBranchLabel = event.label;
  }

  setBranchRequest(event: any) {
    this.documentSearchDto.requestBranchIds = [event.value];
    this.branchLabel = event.label;
  }

  setRegisterUser(event: any) {
    this.documentSearchDto.creatorId = event.id;
    this.user2Label = event.fullName;
  }

  setStartDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.documentDateFrom = convertedDate;
    } else {
      this.documentSearchDto.documentDateFrom = null;
    }
  }

  setEndDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.documentDateTo = convertedDate;
    } else {
      this.documentSearchDto.documentDateTo = null;
    }
  }

  setRegisterFromDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.registerDateFrom = convertedDate;
    } else {
      this.documentSearchDto.registerDateFrom = null;
    }
  }

  setRegisterToDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.registerDateTo = convertedDate;
    } else {
      this.documentSearchDto.registerDateTo = null;
    }
  }

  setType(event: any) {
    this.typeLabel = event.label;
    if (event.value === "ALL") {
      this.documentSearchDto.documentType = null;
    } else {
      this.documentSearchDto.documentType = event.value;
    }
  }

  setState(event: any) {
    this.stateLabel = event.label;
    if (event.value === "ALL") {
      this.documentSearchDto.state = null;
    } else {
      this.documentSearchDto.state = event.value;
    }
  }

  setConfirmUser(event: any) {
    this.documentSearchDto.confirmerId = event.id;
    this.userLabel = event.fullName;
  }

  search() {
    if (Object.keys(this.documentSearchDto).length !== 0) {
      this.isSearch = true;
      this.resultCount = null;
      this.documentRequestService
        .getAllDocumentRequest(
          0,
          10,
          "registerDate",
          ",desc",
          this.documentSearchDto
        )
        .then((res: any) => {
          this.documentData = res.content;
          this.fileContradictionModel = res.content;
          this.page = res.page;
          this.resultCount = res.totalElements;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      this.isSearch = false;
      this.ngOnInit();
      this.getAllRequests();
    }
  }

  resetSearchItems() {
    this.formGroup.reset();
    this.documentSearchDto.registerDateFrom = null;
    this.documentSearchDto.registerDateTo = null;
    this.documentSearchDto.documentDateFrom = null;
    this.documentSearchDto.documentDateTo = null;
    this.documentSearchDto = {};
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
  }
  //
  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      return this.persianCalendarService.PersianCalendarNumericFormat(sendDate);
    }
  }

  getStatus(type: RequestState) {
    return RequestState[type];
  }

  getType(type: DocumentSetRequestTypeEnum) {
    return DocumentSetRequestTypeEnum[type];
  }

  getRequestType(type: RequestTypeAdmin) {
    return RequestTypeAdmin[type];
  }

  loadDocumentSets(event: LazyLoadEvent) {
    this.currentPage = event.first / 10;

    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.documentRequestService
        .getAllDocumentRequest(0, 10, "registerDate", ",desc", {})
        .then((res: any) => {
          this.documentData = res.content;
          this.fileContradictionModel = res.content;
          this.resultCount = res.totalElements;
          this.page = res.page;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      event.sortField === undefined
        ? (event.sortField = "registerDate")
        : event.sortField;
      if (event.sortOrder === 1) {
        this.ordering = ",desc";
      } else if (event.sortOrder === -1) {
        this.ordering = ",asc";
      }
      this.documentData = [];

      if (this.fileContradictionModel) {
        if (this.isSearch) {
          this.documentRequestService
            .getAllDocumentRequest(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering,
              this.documentSearchDto
            )
            .then((res: any) => {
              this.documentData = res.content;
              this.resultCount = res.totalElements;
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        } else {
          this.documentRequestService
            .getAllDocumentRequest(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering,
              {}
            )
            .then((res: any) => {
              this.documentData = res.content;
              this.resultCount = res.totalElements;
            })
            .catch(() => {
              this.toastr.error(
                "مشکل ارتباط با سرور، مجدد تلاش نمایید!",
                "خطا"
              );
            });
        }
      }
    }
  }

  getAllRequests() {
    this.isSearch = false;
    this.resultCount = null;
    this.documentRequestService
      .getAllDocumentRequest(0, 10, "registerDate", ",desc", {})
      .then((res: any) => {
        this.documentData = res.content;
        this.fileContradictionModel = res.content;
        this.resultCount = res.totalElements;
        this.page = res.page;
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  confirmDoc(id) {
    let request = {
      description: "",
      ids: [id],
      operation: "confirm",
    };
    swal
      .fire({
        title: "آیا از تائید اطمینان دارید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله تایید کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.documentRequestService.branchOperation(request).then(() => {
            this.toastr.success("تائید  با موفقیت انجام شد.");
            this.selectedFiles = [];
            this.loadDocumentSets({
              first: this.currentPage * 10,
              rows: 10,
            });
          });
        }
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  public cancelDoc(id) {
    let request = {
      description: this.description,
      ids: [id],
      operation: "reject",
    };
    this.documentRequestService
      .branchOperation(request)
      .then((res) => {
        this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });

        this.selectedFiles = [];
        this.ngbModalRef.close();
        this.modalService.dismissAll();

        this.toastr.success("عدم تایید  با موفقیت انجام شد.");
      })

      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  openModalFileClick(content, selectedFile?: FileContradictionModel) {
    this.description = "";
    this.selectedFile = selectedFile;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  openModalAddFileClick(content, selectedFile?: FileContradictionModel) {
    this.description = "";
    this.selectedFile = selectedFile;
    this.ngbModalRef = this.modalService.open(content, {
      windowClass: "my-class",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  openModalShowClick(content, selectedFile?: FileContradictionModel) {
    this.selectedFile = selectedFile;
    this.selectedFile.lastState.seen = true;
    this.documentRequestService.getDocById(selectedFile.id).then((res) => {
      this.states = res.states;
    });
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  submitNew(event?: any) {
    this.ngbModalRef.close();
    if (event && event != false) {
      this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
    }
  }

  refreshPage(event?: any) {
    if (event && event != false) {
      this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
    }
  }

  downloadFile() {
    this.isLoading = true;
    this.documentRequestService
      .showContent(this.selectedFile.branchFileUuid)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response) => {
        let FileName = response.headers
          .get("content-disposition")
          .toString()
          .split("=")[1];

        let blob: Blob = response.body as Blob;
        let a = document.createElement("a");

        a.href = URL.createObjectURL(
          new Blob([blob], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          })
        );
        this.content = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(
            new Blob([blob], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            })
          )
        );
        this.imageURL = URL.createObjectURL(
          new Blob([blob], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          })
        );
        a.download = FileName;
        a.click();
      });
  }
}
