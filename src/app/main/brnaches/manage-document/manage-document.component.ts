import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import swal from "sweetalert2";
import { PersianCalendarService } from "../../../shared/services/persian-calendar.service";
import { BranchDtoModel } from "../../documents/assign-branch/branch.model";
import { ManageDocumentService } from "../../service/manage-document.service";
import { UserService } from "../../service/user.service";
import { DocumentEnumUtil } from "./document-enum.util";
import { DocumentSetStateEnum } from "./document-set-state.enum";
import { DocumentSetTypeEnum } from "./document-set-type.enum";
import { DocumentSetModel } from "./document-set.model";
import { UserModel } from "./user.model";

@Component({
  selector: "app-manage-document",
  templateUrl: "./manage-document.component.html",
  styleUrls: ["./manage-document.component.scss"],
})
export class ManageDocumentComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  documentSearchDto: DocumentSetModel = {};
  documentSets: DocumentSetModel[];
  selectedDocumentSets: DocumentSetModel[] = [];
  documentData: DocumentSetModel[];
  userList: UserModel[];
  userList2: UserModel[];
  isLoading: boolean = false;
  typeKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));
  statusKeys = Object.keys(DocumentSetStateEnum).map((key) => ({
    label: DocumentSetStateEnum[key],
    value: key,
  }));
  selectedItems: any[] = null;
  selectedDoc: DocumentSetModel;
  content: any;
  imageURL: SafeUrl;
  branch: string = "-";
  panelOpenState = false;
  resultCount: number = 0;
  selectAll: boolean = false;
  totalPages: number = 0;
  page: number = 0;
  rows = 10;
  isSearch: boolean = false;
  ordering: string = ",desc";
  profileId: string;
  roleName: string;
  isFirstLoad: boolean = true;

  typeBranchKeys: any[] = [];

  branchContentDropDown: BranchDtoModel[];

  currentPage: number;

  typeLabel: any = "";
  statusLabel: any = "";
  userLabel: any = "";
  user2Label: any = "";
  branchLabel: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private persianCalendarService: PersianCalendarService,
    private manageDocumentService: ManageDocumentService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      createDateFrom: new FormControl(""),
      createDateTo: new FormControl(""),
      FromDate: new FormControl(""),
      ToDate: new FormControl(""),
      type: new FormControl(""),
      status: new FormControl(""),
      creator: new FormControl(""),
      acceptor: new FormControl(""),
      rowNumber: new FormControl(""),
      branchIds: new FormControl(
        localStorage
          .getItem("branchCode")
          .concat("-", localStorage.getItem("branchName"))
      ),
    });
    this.branch = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
    this.profileId = localStorage.getItem("profileId");
    this.roleName = localStorage.getItem("roleName");
    this.getAllUsers();

    if (this.roleName === "ADMIN") {
      this.manageDocumentService
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

  setBranch(event: any) {
    this.documentSearchDto.branchIds = [event.value.value];
    this.branchLabel = event.value.label;
  }

  setStartDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.fromDate = convertedDate;
    } else {
      this.documentSearchDto.fromDate = null;
    }
  }

  setEndDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.toDate = convertedDate;
    } else {
      this.documentSearchDto.toDate = null;
    }
  }

  setRegisterFromDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.registerFromDate = convertedDate;
    } else {
      this.documentSearchDto.registerFromDate = null;
    }
  }

  setRegisterToDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.registerToDate = convertedDate;
    } else {
      this.documentSearchDto.registerToDate = null;
    }
  }

  getAllDocumentSet() {
    this.isSearch = false;
    this.resultCount = null;
    this.manageDocumentService
      .getAllDocumentSet(0, 10, "registerDate", ",desc")
      .then((res: any) => {
        this.documentSets = res.content;
        this.documentData = res.content;
        this.resultCount = res.totalElements;
        this.page = res.page;
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  loadDocumentSets(event: LazyLoadEvent) {
    this.currentPage = event.first / 10;

    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.manageDocumentService
        .getAllDocumentSet(0, this.rows, "registerDate", ",desc")
        .then((res: any) => {
          this.documentSets = res.content;
          this.documentData = res.content;
          this.resultCount = res.totalElements;
          this.page = res.page;
        })
        .catch(() => {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
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
      if (this.documentSets) {
        if (this.isSearch) {
          this.manageDocumentService
            .getAllDocumentSetWithSearch(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering,
              this.documentSearchDto
            )
            .then((res: any) => {
              this.documentData = res.content;
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        } else {
          this.manageDocumentService
            .getAllDocumentSet(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering
            )
            .then((res: any) => {
              this.documentData = res.content;
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

  getAllUsers() {
    this.userService
      .getRegistrar()
      .then((res) => {
        this.userList = res;
        if (this.userList.length > 0) {
          this.userList.forEach(
            (item) => (item.fullName = item.firstName + " " + item.lastName)
          );
        }
        this.onPageChange({ first: 0, rows: this.itemsPerPage });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
    this.userService
      .getConfirmer()
      .then((res) => {
        this.userList2 = res;
        if (this.userList2.length > 0) {
          this.userList2.forEach(
            (item) => (item.fullName = item.firstName + " " + item.lastName)
          );
        }
        this.onPageChange2({ first: 0, rows: this.itemsPerPage });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  currentPageItemsUser: any[] = [];
  currentPageItemsUser2: any[] = [];
  itemsPerPage = 1500; // Number of items to display per page

  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItemsUser = this.userList.slice(startIndex, endIndex);
  }

  onPageChange2(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItemsUser2 = this.userList2.slice(startIndex, endIndex);
  }

  deleteAllSelectedDocumentSet() {
    swal
      .fire({
        title: "آیا حذف دسته اسناد انتخاب شده را تایید می کنید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        inputPlaceholder: "حذف کنید",
        confirmButtonText: "!بله",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.manageDocumentService
            .deleteDocumentSetById(
              this.selectedDocumentSets.map((item) => item.id)
            )
            .then((res) => {
              this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
              this.selectedDocumentSets = [];
              this.toastr.success("حذف دسته اسناد با موفقیت انجام شد.");
            })
            .catch(() => {
              this.toastr.error(
                "مشکل ارتباط با سرور، مجدد تلاش نمایید!",
                "خطا"
              );
            });
        }
      });
  }

  sendToSuperiors(id) {
    swal
      .fire({
        title: "آیا از ارسال دسته اسناد به مافوق اطمینان  دارید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        inputPlaceholder: "",
        confirmButtonText: "!بله ",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          let request = {
            ids: [id],
            operation: "confirm",
          };
          this.manageDocumentService
            .completeDocumentSet(request)
            .then(() => {
              this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
              this.passEntry.emit(this.currentPage);
              this.toastr.success("ارسال به مافوق با موفقیت انجام شد.");
              this.selectedDocumentSets = [];
            })
            .catch(() => {
              this.toastr.error(
                "مشکل ارتباط با سرور، مجدد تلاش نمایید!",
                "خطا"
              );
            });
        }
      });
  }

  getExcelDocumentSet() {
    this.isLoading = true;
    this.manageDocumentService
      .getExcelDocumentSetById(this.documentSearchDto)
      .subscribe((res: Blob) => {
        this.downloadBuffer(res, "file.xlsx");
        this.isLoading = false;
      });
  }

  downloadBuffer(arrayBuffer, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
    );
    this.content = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(
        new Blob([arrayBuffer], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        })
      )
    );
    this.imageURL = URL.createObjectURL(
      new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
    );
    a.download = name;
    a.click();
  }

  submitNew(event?: any) {
    this.ngbModalRef.close();
    if (event && event != false) {
      this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
    }
  }

  submitNewShow(event?: any) {
    this.ngbModalRef.close();
    this.selectedDoc.state.seen = true;

    if (event && event != false) {
      this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
    }
  }

  openModalClick(content, selectedDoc?: DocumentSetModel) {
    this.selectedDoc = selectedDoc;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }
  openModalClickConf(content, selectedDoc?: DocumentSetModel) {
    this.manageDocumentService.getDocumentSetById(selectedDoc.id);
    this.selectedDoc = selectedDoc;
    this.selectedDoc.state.seen = true;

    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }

  openModalFileClick(content, selectedDoc?: DocumentSetModel) {
    this.selectedDoc = selectedDoc;
    this.selectedDoc.state.seen = true;

    this.ngbModalRef = this.modalService.open(content, {
      windowClass: "my-class",
    });
    this.ngbModalRef.result.then(() => {
      this.passEntry.emit();
    });
  }

  getType(type: DocumentSetTypeEnum) {
    return DocumentSetTypeEnum[type];
  }

  getState(state: any) {
    return DocumentSetStateEnum[state];
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      return this.persianCalendarService.PersianCalendarNumericFormat(sendDate);
    }
  }

  search() {
    if (Object.keys(this.documentSearchDto).length !== 0) {
      this.isSearch = true;
      this.resultCount = null;
      this.manageDocumentService
        .getAllDocumentSetWithSearch(
          0,
          10,
          "registerDate",
          ",desc",
          this.documentSearchDto
        )
        .then((res: any) => {
          this.documentSets = res.content;
          this.documentData = res.content;
          this.page = res.page;
          this.resultCount = res.totalElements;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      this.isSearch = false;
      this.ngOnInit();
      this.getAllDocumentSet();
    }
  }

  setType(event: any) {
    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto.type = DocumentEnumUtil.getValue(event.value);
      this.typeLabel = event.value.label;
    }
  }

  setState(event: any) {
    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto.status = [DocumentEnumUtil.getValue(event.value)];
      this.statusLabel = event.value.label;
    }
  }

  setRegisterUser(event: any) {
    this.documentSearchDto.registrarId = event.value.id;
    this.userLabel = event.value.fullName;
  }

  setConfirmUser(event: any) {
    this.documentSearchDto.confirmerId = event.value.id;
    this.user2Label = event.value.fullName;
  }

  resetSearchItems() {
    this.isSearch = false;
    // this.resultCount = null;
    this.formGroup.reset();
    this.branch = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
    this.documentSearchDto.fromDate = null;
    this.documentSearchDto.toDate = null;
    this.documentSearchDto.registerFromDate = null;
    this.documentSearchDto.registerToDate = null;
    this.documentSearchDto = {};
  }
}
