import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "jalali-moment";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { BranchDtoModel } from "../../documents/assign-branch/branch.model";
import { ManageAcceptWaitingService } from "../../service/acceptWaiting.service";
import { UserService } from "../../service/user.service";
import { FileContradictionModel } from "../manage-contradiction-in-branch/file-contradiction.model";
import { DocumentEnumUtil } from "../manage-document/document-enum.util";
import {
  DocumentSetStateEnum,
  DocumentStateEnum,
} from "../manage-document/document-set-state.enum";
import { DocumentSetTypeEnum } from "../manage-document/document-set-type.enum";
import { DocumentSetModel } from "../manage-document/document-set.model";
import { UserDtoModel } from "../manage-document/user.model";
import { AcceptWaitingModel } from "./accept-waiting.model";
import { CompleteModel } from "./complete-model";

export enum AcceptManage {
  REGISTERED = "ثبت شده",
  FIX_CONFLICT = "رفع مغایرت دسته اسناد",
}

@Component({
  selector: "app-confirm-package",
  templateUrl: "./confirm-package.component.html",
  styleUrls: ["./confirm-package.component.scss"],
})
export class ConfirmPackageComponent implements OnInit {
  @ViewChild("openModal", { static: true }) openModal;
  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  public formGroup2: FormGroup;

  panelOpenState = false;

  acceptWaitingSet: AcceptWaitingModel[] = [];
  selectedAcceptWaitingSet: AcceptWaitingModel[] = [];
  resultDocumentSetCount: number = 0;
  resultDocumentCount: number = 0;
  selectedFile: FileContradictionModel;

  conflictedDocument: FileContradictionModel[] = [];
  selectedConflictDocument: FileContradictionModel[] = [];
  completeModel: CompleteModel;

  documentData: AcceptWaitingModel[];
  page: number = 0;

  documentSetData: FileContradictionModel[] = [];
  pageSet: number = 0;

  ordering: string = ",desc";
  orderingDoc: string = ",desc";

  descriptionDoc: string = "";

  documentSearchDto: DocumentSetModel = {};
  documentSearchDto2: DocumentSetModel = {};

  roleName: string;

  typeBranchKeys: any[] = [];

  branchContentDropDown: BranchDtoModel[];

  userList: UserDtoModel[];
  userKeys: any[] = [];

  typeKeys = Object.keys(AcceptManage).map((key) => ({
    label: AcceptManage[key],
    value: key,
  }));

  typeDocKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));

  isSearch: boolean = false;
  isSearch2: boolean = false;

  currentPage: number;

  currentPageFile: number;

  typeLabel: any = "";
  stateLabel: any = "";
  userLabel: any = "";
  branchLabel: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private manageAcceptWaitingService: ManageAcceptWaitingService,
    private persianCalendarService: PersianCalendarService,
    private toastr: ToastrService,
    private userService: UserService,
    private modalService: NgbModal
  ) {}
  branchName: string = "";
  description: string;

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      createDateFrom: new FormControl(""),
      createDateTo: new FormControl(""),
      FromDate: new FormControl(""),
      ToDate: new FormControl(""),
      type: new FormControl(""),
      status: new FormControl(""),
      registrarId: new FormControl(""),
      branchIds: new FormControl(""),
      rowNumber: new FormControl(""),
    });
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
    this.getAllUsers();

    this.roleName = localStorage.getItem("roleName");

    if (this.roleName === "ADMIN") {
      this.manageAcceptWaitingService
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

    this.formGroup2 = this.formBuilder.group({
      createDateFrom: new FormControl(""),
      createDateTo: new FormControl(""),
      FromDate: new FormControl(""),
      ToDate: new FormControl(""),
      type: new FormControl(""),
      state: new FormControl(""),
      creator: new FormControl(""),
      acceptor: new FormControl(""),
      branchIds: new FormControl(""),
      filename: new FormControl(""),
      documentNumber: new FormControl(""),
      maintenanceCode: new FormControl(""),
      documentDate: new FormControl(""),
    });
  }

  itemsPerPage = 1500; // Number of items to display per page

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

  setState(event: any) {
    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto.status = [DocumentEnumUtil.getValue(event.value)];
      this.stateLabel = event.value.label;
    }
  }

  setType(event: any) {
    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto.type = DocumentEnumUtil.getValue(event.value);
      this.typeLabel = event.value.label;
      console.log(event);
    }
  }

  setRegisterUser(event: any) {
    this.documentSearchDto.registrarId = event.value.value;
    this.userLabel = event.value.label;
  }

  getAllUsers() {
    this.userService
      .getRegistrar()
      .then((res) => {
        this.userList = res;
        this.userList.forEach((k) => {
          this.userKeys.push({
            label: k.fullName,
            value: k.id,
          });
        });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  search() {
    if (Object.keys(this.documentSearchDto).length !== 0) {
      if (this.documentSearchDto.status == undefined) {
        this.documentSearchDto.status = ["REGISTERED", "FIX_CONFLICT"];
      }
      this.isSearch = true;
      this.resultDocumentSetCount = null;
      this.manageAcceptWaitingService
        .getAllDocumentSetWithSearch(
          0,
          10,
          "registerDate",
          ",desc",
          this.documentSearchDto
        )
        .then((res: any) => {
          this.acceptWaitingSet = res.content;
          this.documentData = res.content;
          this.page = res.page;
          this.resultDocumentSetCount = res.totalElements;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      this.isSearch = false;
      this.ngOnInit();
      this.getAllAcceptWaitingDocument();
    }
  }

  resetSearchItems() {
    this.isSearch = false;
    // this.resultCount = null;
    this.formGroup.reset();
    this.documentSearchDto = {};
    this.documentSearchDto.fromDate = null;
    this.documentSearchDto.toDate = null;
    this.documentSearchDto.registerFromDate = null;
    this.documentSearchDto.registerToDate = null;
    this.documentSearchDto.status = ["REGISTERED", "FIX_CONFLICT"];
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
  }

  getAllAcceptWaitingDocument() {
    this.resultDocumentSetCount = null;

    this.manageAcceptWaitingService
      .getAllAcceptWaitingSet(0, 10, "registerDate", ",desc")
      .then((res: any) => {
        this.acceptWaitingSet = res.content;
        this.documentData = res.content;
        this.resultDocumentSetCount = res.totalElements;
        this.page = res.page;
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  loadDocumentSets(event: LazyLoadEvent) {
    this.currentPage = event.first / 10;

    event.sortField === undefined
      ? (event.sortField = "registerDate")
      : event.sortField;
    if (event.sortOrder === 1) {
      this.ordering = ",desc";
    } else if (event.sortOrder === -1) {
      this.ordering = ",asc";
    }
    this.documentData = [];
    if (this.acceptWaitingSet) {
      if (this.isSearch) {
        if (this.documentSearchDto.status == undefined) {
          this.documentSearchDto.status = ["REGISTERED", "FIX_CONFLICT"];
        }
        this.manageAcceptWaitingService
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
        this.manageAcceptWaitingService
          .getAllAcceptWaitingSet(
            event.first / 10,
            event.rows,
            event.sortField,
            this.ordering
          )
          .then((res: any) => {
            this.documentData = res.content;
            this.acceptWaitingSet = res.content;
            this.resultDocumentSetCount = res.totalElements;
            this.page = res.page;
          })
          .catch(() =>
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
          );
      }
    }
  }

  getFixedConflictedDocument() {
    this.resultDocumentCount = null;

    this.manageAcceptWaitingService
      .getFixedConflictedDocuments(0, 10, "registerDate", ",desc")
      .then((res: any) => {
        this.documentSetData = res.content;
        this.conflictedDocument = res.content;
        this.resultDocumentCount = res.totalElements;
        this.pageSet = res.page;
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  loadDocumentSetSets(event: LazyLoadEvent) {
    this.currentPageFile = event.first / 10;

    event.sortField === undefined
      ? (event.sortField = "registerDate")
      : event.sortField;
    if (event.sortOrder === 1) {
      this.ordering = ",desc";
    } else if (event.sortOrder === -1) {
      this.ordering = ",asc";
    }
    this.documentSetData = [];
    if (this.conflictedDocument) {
      if (this.isSearch2) {
        if (this.documentSearchDto2.status == undefined) {
          this.documentSearchDto2.status = ["FIX_CONFLICT"];
        }
        this.manageAcceptWaitingService
          .getAllDocumentWithSearch(
            event.first / 10,
            event.rows,
            event.sortField,
            this.ordering,
            this.documentSearchDto2
          )
          .then((res: any) => {
            this.documentSetData = res.content;
          })
          .catch(() =>
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
          );
      } else {
        this.manageAcceptWaitingService
          .getFixedConflictedDocuments(
            event.first / 10,
            event.rows,
            event.sortField,
            this.orderingDoc
          )
          .then((res: any) => {
            this.documentSetData = res.content;
            this.conflictedDocument = res.content;
            this.resultDocumentCount = res.totalElements;
            this.pageSet = res.page;
          })
          .catch(() =>
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
          );
      }
    }
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      return this.persianCalendarService.PersianCalendarNumericFormat(sendDate);
    }
  }

  getType(type: DocumentSetTypeEnum) {
    return DocumentSetTypeEnum[type];
  }

  getState(state: DocumentSetStateEnum) {
    return DocumentSetStateEnum[state];
  }

  getStatus(type: DocumentStateEnum) {
    return DocumentStateEnum[type];
  }

  confirmDoc() {
    swal
      .fire({
        title: "آیاارسال به اداره اسناد را تایید می کنید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          let request = {
            ids: this.selectedAcceptWaitingSet.map((item) => item.id),
            operation: "confirm",
          };
          this.manageAcceptWaitingService.acceptDocument(request).then(() => {
            this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
            this.toastr.success(
              "دسته اسناد انتخاب شده، تایید و برای اداره اسناد ارسال شد."
            );
            this.selectedAcceptWaitingSet = [];
          });
        }
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  confirmFile() {
    swal
      .fire({
        title: "آیا اسناد ثبت شده را تایید می کنید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله تایید کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          let request = {
            ids: this.selectedConflictDocument.map((item) => item.id),
          };
          this.manageAcceptWaitingService
            .acceptFileDocument(request)
            .then(() => {
              this.loadDocumentSetSets({
                first: this.currentPageFile * 10,
                rows: 10,
              });
              this.selectedConflictDocument = [];
              this.toastr.success("تائید اسناد با موفقیت انجام شد.");
            });
        }
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  public cancelDoc() {
    let request = {
      description: this.descriptionDoc,
      ids: this.selectedAcceptWaitingSet.map((item) => item.id),
      operation: "reject",
    };
    this.manageAcceptWaitingService
      .acceptDocument(request)
      .then((res) => {
        this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
        this.selectedAcceptWaitingSet = [];
        this.ngbModalRef.close();
        this.modalService.dismissAll();

        this.toastr.success("عدم تایید  با موفقیت انجام شد.");
      })

      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  openModalFileClick(content, selectedFile?: FileContradictionModel) {
    this.descriptionDoc = "";
    this.selectedFile = selectedFile;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  openModalFileClickShow(content, selectedFile?: FileContradictionModel) {
    this.descriptionDoc = "";
    this.selectedFile = selectedFile;

    this.manageAcceptWaitingService.getDocumentSetById(selectedFile.id);
    this.selectedFile.state.seen = true;

    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  openModalShowClick(content, selectedFile?: FileContradictionModel) {
    this.selectedFile = selectedFile;
    this.selectedFile.state.seen = true;
    this.manageAcceptWaitingService.getDocById(selectedFile.id);

    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  resetSearchItems2() {
    this.isSearch2 = false;
    this.formGroup2.reset();
    this.documentSearchDto2 = {};
    this.documentSearchDto2.fromDate = null;
    this.documentSearchDto2.toDate = null;
    this.documentSearchDto2.registerFromDate = null;
    this.documentSearchDto2.registerToDate = null;
    this.documentSearchDto2.status = ["FIX_CONFLICT"];
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
  }

  search2() {
    if (Object.keys(this.documentSearchDto2).length !== 0) {
      this.documentSearchDto2.status = ["FIX_CONFLICT"];
      this.isSearch2 = true;
      this.resultDocumentCount = null;
      this.manageAcceptWaitingService
        .getAllDocumentWithSearch(
          0,
          10,
          "registerDate",
          ",desc",
          this.documentSearchDto2
        )
        .then((res: any) => {
          this.documentSetData = res.content;
          this.conflictedDocument = res.content;
          this.pageSet = res.page;
          this.resultDocumentCount = res.totalElements;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      this.isSearch2 = false;
      this.ngOnInit();
      this.getFixedConflictedDocument();
    }
  }

  setBranch2(event: any) {
    this.documentSearchDto2.branchIds = [event.value.value];
    this.branchLabel = event.value.label;
  }

  setStartDate2(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto2.fromDate = convertedDate;
    } else {
      this.documentSearchDto2.fromDate = null;
    }
  }

  setDocumentDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      const outputDate = moment(convertedDate, "YYYY-MM-DD").format(
        "jYYYY/jMM/jDD"
      );

      this.documentSearchDto2.documentDate = outputDate;
    } else {
      this.documentSearchDto2.documentDate = null;
    }
  }

  setEndDate2(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto2.toDate = convertedDate;
    } else {
      this.documentSearchDto2.toDate = null;
    }
  }

  setRegisterFromDate2(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto2.registerFromDate = convertedDate;
    } else {
      this.documentSearchDto2.registerFromDate = null;
    }
  }

  setRegisterToDate2(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto2.registerToDate = convertedDate;
    } else {
      this.documentSearchDto2.registerToDate = null;
    }
  }
}
