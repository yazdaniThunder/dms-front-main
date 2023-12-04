import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { finalize } from "rxjs/operators";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { RequestStateOffice } from "../../brnaches/manage-document/document-set-state.enum";
import { DocumentSetRequestTypeEnum } from "../../brnaches/manage-document/document-set-type.enum";
import { UserModel } from "../../brnaches/manage-document/user.model";
import { StatesModel } from "../../brnaches/manage-request/states.model";
import { DocumentRequestModel } from "../../brnaches/request-modal/document-request.model";
import { RequestTypeAdmin } from "../../brnaches/request-modal/request-modal.component";
import { SearchRequestModel } from "../../brnaches/search-request-sent/search-request.model";
import { RequestInDocService } from "../../service/request-in-doc-service";
import { UserService } from "../../service/user.service";
import { BranchDtoModel } from "../assign-branch/branch.model";

@Component({
  selector: "app-manage-request",
  templateUrl: "./manage-request-dcoument.component.html",
  styleUrls: ["./manage-request-document.component.scss"],
})
export class ManageRequestDocumentComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  typeKeys = Object.keys(DocumentSetRequestTypeEnum).map((key) => ({
    label: DocumentSetRequestTypeEnum[key],
    value: key,
  }));
  stateKeys = Object.keys(RequestStateOffice).map((key) => ({
    label: RequestStateOffice[key],
    value: key,
  }));
  panelOpenState = false;
  branchName: string = "";
  resultCount: number = 0;
  page: number = 0;
  isSearch: boolean = false;
  ordering: string = ",desc";
  documentData: DocumentRequestModel[];
  selectedItem: DocumentRequestModel[] = [];
  fileContradictionModel: DocumentRequestModel[];
  selectedFile: DocumentRequestModel;
  typeBranchKeys: any[] = [];
  requestBranchKeys: any[] = [];
  branchContent: BranchDtoModel[];
  userList: UserModel[];
  userList2: UserModel[];
  documentSearchDto: SearchRequestModel = {};
  shortLink: string = "";
  loading: boolean = false;

  imageURL: SafeUrl;
  isLoading: boolean = false;
  content: any;
  open: boolean = false;
  states: StatesModel[];
  roleCheck: string;
  roleName: string;
  isFirstLoad: boolean = true;

  currentPage: number;

  descriptionDoc: string = "";

  selectedFiles: File[] = [];

  @ViewChild("fileInput", { static: false })
  fileInput: ElementRef<HTMLInputElement>;

  typeBranchLabel: any = "";
  requestLabel: any = "";
  userLabel: any = "";
  stateLabel: any = "";
  branchLabel: any = "";
  user2Label: any = "";
  typeLabel: any = "";

  constructor(
    private persianCalendarService: PersianCalendarService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private requestInDocService: RequestInDocService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.roleCheck = localStorage.getItem("roleName");

    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));

    this.roleName = localStorage.getItem("roleName");

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
      documentBranchId: new FormControl(""),
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
  getAllBranch() {
    if (this.roleName === "DOPU") {
      this.requestInDocService
        .getAllRequestBranches()
        .then((res: any) => {
          this.branchContent = res;
          this.branchContent.forEach((k) => {
            this.requestBranchKeys.push({
              label: k.branchName + "-" + k.branchCode,
              value: k.id,
            });
          });
          this.onPageChange2({ first: 0, rows: this.itemsPerPage });
        })
        .catch(() => {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
    } else {
      this.requestInDocService
        .getAllBranchesList()
        .then((res: any) => {
          this.branchContent = res;
          this.branchContent.forEach((k) => {
            this.typeBranchKeys.push({
              label: k.branchName + "-" + k.branchCode,
              value: k.id,
            });
          });
          this.onPageChange({ first: 0, rows: this.itemsPerPage });
        })
        .catch(() => {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
    }
  }

  currentPageItemsUser2: any[] = [];

  onPageChangeUser2(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItemsUser2 = this.userList2.slice(startIndex, endIndex);
  }

  currentPageItems: any[] = [];
  currentPageItems2: any[] = [];

  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItems = this.typeBranchKeys.slice(startIndex, endIndex);
  }

  onPageChange2(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItems2 = this.requestBranchKeys.slice(startIndex, endIndex);
  }

  setBranch(event: any) {
    this.branchLabel = event.label;
    this.documentSearchDto.documentBranchIds = [event.value];
  }

  setrequestBranch(event: any) {
    this.typeBranchLabel = event.label;
    this.documentSearchDto.requestBranchIds = [event.value];
  }

  setRegisterUser(event: any) {
    this.user2Label = event.fullName;
    this.documentSearchDto.creatorId = event.id;
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
    this.userLabel = event.fullName;
    this.documentSearchDto.confirmerId = event.id;
  }

  loadDocumentSets(event: LazyLoadEvent) {
    this.currentPage = event.first / 10;

    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.requestInDocService
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

      //imitate db connection over a network
      if (this.fileContradictionModel) {
        if (this.isSearch) {
          this.requestInDocService
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
          this.requestInDocService
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

  search() {
    if (Object.keys(this.documentSearchDto).length !== 0) {
      this.isSearch = true;
      this.resultCount = null;
      this.requestInDocService
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
  getAllRequests() {
    this.isSearch = false;
    this.resultCount = null;
    this.requestInDocService
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

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      return this.persianCalendarService.PersianCalendarNumericFormat(sendDate);
    }
  }

  getType(type: DocumentSetRequestTypeEnum) {
    return DocumentSetRequestTypeEnum[type];
  }

  getRequestType(type: RequestTypeAdmin) {
    return RequestTypeAdmin[type];
  }

  getState(state: RequestStateOffice) {
    return RequestStateOffice[state];
  }

  openModalFileClick(content, selectedFile?: DocumentRequestModel) {
    this.selectedFiles = [];
    this.selectedFile = selectedFile;
    this.descriptionDoc = "";

    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
    });
  }

  openModalShowClick(content, selectedFile?: DocumentRequestModel) {
    this.selectedFile = selectedFile;
    this.selectedFile.lastState.seen = true;

    this.requestInDocService.getDocById(selectedFile.id).then((res) => {
      this.states = res.states;
    });
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  submitNew() {
    this.ngbModalRef.close();
    this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
  }

  downloadFile() {
    this.isLoading = true;
    this.requestInDocService
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

  confirmDoc() {
    let request = {
      description: "",
      ids: this.selectedItem.map((x) => x.id),
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
          this.requestInDocService.documentOperation(request).then(() => {
            this.toastr.success("تائید  با موفقیت انجام شد.");
            this.passEntry.emit();
            this.loadDocumentSets({
              first: this.currentPage * 10,
              rows: 10,
            });
          });
        }
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        this.passEntry.emit();
      });
  }

  selectAllRows(event: any) {
    // event.checked will be true when "Select All" is checked, and false when unchecked
    const selectedItems = [];

    // Loop through your data and check the condition for each row
    for (const item of this.documentData) {
      if (
        (event.checked && item.lastState.state === "BRANCH_CONFIRMED") ||
        (!event.checked && item.lastState.state !== "BRANCH_CONFIRMED")
      ) {
        // Select rows that meet the condition when "Select All" is checked
        // Unselect rows that do not meet the condition when "Select All" is unchecked
        selectedItems.push(item);
      }
    }

    // Update the selected items
    this.selectedItem = selectedItems;
  }

  onChange(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.selectedFiles.push(event.target.files[i]);
    }
    // Clear the file input to allow selecting the same files again
    this.fileInput.nativeElement.value = "";
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onUpload() {
    if (this.selectedFiles.length === 0) {
      this.toastr.info("لطفا فایل‌ها را انتخاب کنید.");
    } else {
      this.loading = !this.loading;
      const formData = new FormData();

      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append("files", this.selectedFiles[i]);
      }
      formData.append("requestId", this.selectedFile.id.toString());
      formData.append("description", this.descriptionDoc);

      this.requestInDocService.upload(formData).subscribe(
        (event: any) => {
          if (typeof event === "object") {
            this.shortLink = event.link;
            this.loading = false;
            this.toastr.success("بارگذاری فایل‌ها با موفقیت انجام شد.");
            this.passEntry.emit();
            this.ngbModalRef.close();
            this.loadDocumentSets({
              first: this.currentPage * 10,
              rows: 10,
            });
          }
        },
        (err) => {
          if (err.error.message === "File format must be zip") {
            this.loading = false;
            this.toastr.info("فایل بارگذاری شده باید zip باشد");
            this.selectedFiles = [];
          } else {
            this.loading = false;
            this.toastr.error(
              "مشکل ارتباط با سرور، مجدداً تلاش نمایید!",
              "خطا"
            );
            this.passEntry.emit();
            this.ngbModalRef.close();
          }
        }
      );
    }
  }
}
