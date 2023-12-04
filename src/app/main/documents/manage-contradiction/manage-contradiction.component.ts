import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "jalali-moment";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { DocumentEnumUtil } from "../../brnaches/manage-document/document-enum.util";
import {
  DocumentSetStateEnum,
  DocumentStateEnum,
} from "../../brnaches/manage-document/document-set-state.enum";
import { DocumentSetTypeEnum } from "../../brnaches/manage-document/document-set-type.enum";
import { DocumentSetModel } from "../../brnaches/manage-document/document-set.model";
import { UserModel } from "../../brnaches/manage-document/user.model";
import { ManageContradictionService } from "../../service/manageContradiction.service";
import { UserService } from "../../service/user.service";
import { BranchDtoModel } from "../assign-branch/branch.model";

export enum StatusEnum {
  NOT_CHECKED = "بررسی نشده",
  SENT_CONFLICT = "دارای مغایرت ارسال شده",
  CONFIRM_FIX_CONFLICT = "تایید رفع مغایرت فایل",
}

@Component({
  selector: "app-manage-contradiction",
  templateUrl: "./manage-contradiction.component.html",
  styleUrls: ["./manage-contradiction.component.scss"],
})
export class ManageContradictionComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  documentSearchDto: DocumentSetModel = {};
  documentSets: DocumentSetModel[];
  documentData: DocumentSetModel[];
  userList: UserModel[];
  isLoading: boolean = false;
  typeKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));
  statusKeys = Object.keys(DocumentSetStateEnum).map((key) => ({
    label: DocumentSetStateEnum[key],
    value: key,
  }));
  stateKeys = Object.keys(StatusEnum).map((key) => ({
    label: StatusEnum[key],
    value: key,
  }));
  selectedIds: number[] = [];
  selectedDoc: DocumentSetModel;
  content: any;
  imageURL: SafeUrl;
  branchName: string = "";
  panelOpenState = false;
  resultCount: number = 0;
  page: number = 0;
  isSearch: boolean = false;
  ordering: string = ",desc";

  roleCheck: string;

  isFirstLoad: boolean = true;

  roleName: string;

  typeBranchKeys: any[] = [];

  branchContentDropDown: BranchDtoModel[];

  currentPage: number;

  fileTypeKeys: any[] = [];
  fileStatusKeys: any[] = [];
  otherDocumentType: any[] = [];

  typeOfFile: any[] = [];

  showOther: boolean = false;
  defaultFs: any = "";

  otherDocumentTypeLabel: any = "";
  branchLabel: any = "";
  userLabel: any = "";
  stateLabel: any = "";
  typeLabel: any = "";
  fileTypeLabel: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private persianCalendarService: PersianCalendarService,
    private manageContradictionService: ManageContradictionService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.roleCheck = localStorage.getItem("roleName");

    this.manageContradictionService.getAllFileTypeList().then((res) => {
      this.typeOfFile = res;
      this.fileTypeKeys = this.typeOfFile.map((k) => ({
        label: k.title,
        value: k.title,
        id: k.id,
      }));
    });

    this.formGroup = this.formBuilder.group({
      createDateFrom: new FormControl(""),
      createDateTo: new FormControl(""),
      FromDate: new FormControl(""),
      ToDate: new FormControl(""),
      type: new FormControl(""),
      status: new FormControl(""),
      creator: new FormControl(""),
      acceptor: new FormControl(""),
      branchIds: new FormControl(""),
      states: new FormControl(""),
      filename: new FormControl(""),
      maintenanceCode: new FormControl(""),
      conflictRegisterDate: new FormControl(""),
      reason: new FormControl(""),
      rowNumber: new FormControl(""),
      documentNumber: new FormControl(""),
      customerNumber: new FormControl(""),
      fileNumber: new FormControl(""),
      fileTypeId: new FormControl(""),
      otherDocumentTypeId: new FormControl(""),
      fileStatusId: new FormControl(""),
    });
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
    this.documentSearchDto.branchId = localStorage.getItem("branchId");
    this.getAllUsers();

    this.roleName = localStorage.getItem("roleName");

    if (this.roleName === "ADMIN" || this.roleName === "DOA") {
      this.manageContradictionService
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

    if (this.roleName === "DOEU") {
      this.manageContradictionService
        .getAllBranchesAssignList()
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
    this.branchLabel = event.value.label;
    this.documentSearchDto.branchIds = [event.value.value];
  }

  submitToExpire(id) {
    swal
      .fire({
        title: "آیا راکد نمودن  فایل  را تایید می کنید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        inputPlaceholder: "وارد کنید",
        reverseButtons: true,
        confirmButtonText: "!بله تایید کن",
      })
      .then((result) => {
        if (result.value) {
          this.manageContradictionService
            .stagnateConflictDocument([id])
            .then((res) => {
              this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
              this.toastr.success("راکد نمودن با موفقیت انجام شد.");
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        }
      });
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

  setConflictRegisterDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.conflictRegisterDate = convertedDate;
    } else {
      this.documentSearchDto.conflictRegisterDate = null;
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

  getAllDocumentSet() {
    this.resultCount = null;
    this.isSearch = false;
    this.manageContradictionService
      .getmanageConflictedDocuments({}, 0, 10, "register_Date", ",desc")
      .then((res: any) => {
        this.documentSets = res.content;
        this.resultCount = res.totalElements;
        this.documentData = res.content;
        this.page = res.page;
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  getAllUsers() {
    let obj = ["DOEU", "DOPU", "DOA"];

    this.userService
      .getOfficeUsers(obj)
      .then((res) => {
        this.userList = res.map((k) => k.user);
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
  }

  currentPageItemsUser: any[] = [];
  itemsPerPage = 1500; // Number of items to display per page

  onPageChangeUser(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItemsUser = this.userList.slice(startIndex, endIndex);
  }

  submitNew() {
    this.ngbModalRef.close();
    this.passEntry.emit();
    this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
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

  openModalClickShow(content, selectedDoc?: DocumentSetModel) {
    this.selectedDoc = selectedDoc;
    this.selectedDoc.state.seen = true;
    this.manageContradictionService.getDocById(selectedDoc.id);

    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }

  getType(type: DocumentSetTypeEnum) {
    if (type == null) {
      return "-";
    } else {
      return DocumentSetTypeEnum[type];
    }
  }

  getState(state: any) {
    if (state == null) {
      return "-";
    } else {
      return DocumentStateEnum[state];
    }
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      return this.persianCalendarService.PersianCalendarNumericFormat(sendDate);
    }
  }

  onSelectedItem(documentSetModel: DocumentSetModel) {
    const index = this.selectedIds.indexOf(documentSetModel.id, 0);
    if (index > -1) {
      this.selectedIds.splice(index, 1);
    } else {
      this.selectedIds.push(documentSetModel.id);
    }
  }

  loadDocumentSets(event: LazyLoadEvent) {
    this.currentPage = event.first / 10;

    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.manageContradictionService
        .getmanageConflictedDocuments({}, 0, 10, "register_Date", ",desc")
        .then((res: any) => {
          this.documentSets = res.content;
          this.resultCount = res.totalElements;
          this.documentData = res.content;
          this.page = res.page;
        })
        .catch(() => {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
    } else {
      event.sortField === undefined
        ? (event.sortField = "register_Date")
        : event.sortField;
      if (event.sortOrder === 1) {
        this.ordering = ",desc";
      } else if (event.sortOrder === -1) {
        this.ordering = ",asc";
      }
      this.documentData = [];
      if (this.documentSets) {
        if (this.isSearch) {
          this.manageContradictionService
            .getmanageConflictedDocuments(
              this.documentSearchDto,
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering
            )
            .then((res: any) => {
              this.documentData = res.content;
              this.resultCount = res.totalElements;
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        } else {
          this.manageContradictionService
            .getmanageConflictedDocuments(
              {},
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering
            )
            .then((res: any) => {
              this.documentData = res.content;
              this.resultCount = res.totalElements;
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        }
      }
    }
  }

  search() {
    if (Object.keys(this.documentSearchDto).length !== 0) {
      this.isSearch = true;
      this.resultCount = null;
      this.manageContradictionService
        .getmanageConflictedDocuments(
          this.documentSearchDto,
          0,
          10,
          "register_Date",
          ",desc"
        )
        .then((res: any) => {
          this.documentSets = res.content;
          this.documentData = res.content;
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
    this.typeLabel = event.value.label;
    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto.type = DocumentEnumUtil.getValue(event.value);
    }
    if (event.value.value !== "DAILY" && event.value.value !== "CHAKAVAK") {
      this.showOther = true;
    } else {
      this.showOther = false;
      this.documentSearchDto.fileStatusId = null;
      this.documentSearchDto.fileTypeId = null;
      this.documentSearchDto.otherDocumentTypeId = null;
      this.documentSearchDto.customerNumber = null;
      this.documentSearchDto.fileNumber = null;
    }
  }

  setState(event: any) {
    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto.status = DocumentEnumUtil.getValue(event.value);
    }
  }

  setStatus(event: any) {
    this.stateLabel = event.value.label;

    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto.states = [DocumentEnumUtil.getValue(event.value)];
    }
  }

  setRegisterUser(event: any) {
    this.userLabel = event.value.fullName;
    this.documentSearchDto.registrarId = event.value.id;
  }

  setDocumentDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      const outputDate = moment(convertedDate, "YYYY-MM-DD").format(
        "jYYYY/jMM/jDD"
      );

      this.documentSearchDto.documentDate = outputDate;
    } else {
      this.documentSearchDto.documentDate = null;
    }
  }

  resetSearchItems() {
    this.isSearch = false;
    this.formGroup.reset();
    this.documentSearchDto = {};
    this.documentSearchDto.fromDate = null;
    this.documentSearchDto.toDate = null;
    this.documentSearchDto.registerFromDate = null;
    this.documentSearchDto.registerToDate = null;
    this.documentSearchDto.conflictRegisterDate = null;
    this.documentSearchDto.customerNumber = null;
    this.documentSearchDto.fileNumber = null;
    this.documentSearchDto.fileTypeId = null;
    this.documentSearchDto.otherDocumentTypeId = null;
    this.documentSearchDto.fileStatusId = null;
    this.otherDocumentType = [];
    this.fileStatusKeys = [];
    this.showOther = false;
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
    this.defaultFs = "";
  }

  setFileTypeId(event: any) {
    this.fileTypeLabel = event.value.label;
    this.defaultFs = "";

    const selectedType = event.value.value;

    this.documentSearchDto.fileTypeId = event.value.id;

    const selectedTypeObject = this.typeOfFile.find(
      (type) => type.title === selectedType
    );

    this.otherDocumentType = selectedTypeObject.otherDocumentTypes.map(
      (docType) => ({
        label: docType.title,
        value: docType.id,
      })
    );

    this.fileStatusKeys = selectedTypeObject.fileStatuses.map((status) => ({
      label: status.title,
      value: status.id,
      isDefault: status.isDefault,
    }));
    this.defaultFs = this.fileStatusKeys.find((k) => k.isDefault);
    this.documentSearchDto.fileStatusId = this.defaultFs.value;
  }

  setOtherDocumentTypeId(event: any) {
    this.otherDocumentTypeLabel = event.value.label;
    this.documentSearchDto.otherDocumentTypeId = event.value.value;
  }

  setFileStatusId(event: any) {
    this.documentSearchDto.fileStatusId = event.value.value;
  }
}
