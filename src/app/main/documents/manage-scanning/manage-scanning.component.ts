import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { FileContradictionModel } from "../../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { DocumentEnumUtil } from "../../brnaches/manage-document/document-enum.util";
import { DocumentSetStateEnum } from "../../brnaches/manage-document/document-set-state.enum";
import { DocumentSetTypeEnum } from "../../brnaches/manage-document/document-set-type.enum";
import { DocumentSetModel } from "../../brnaches/manage-document/document-set.model";
import { ProfileDtoModel } from "../../brnaches/manage-document/user.model";
import { ScanService } from "../../service/scan.service";
import { UserService } from "../../service/user.service";
import { BranchDtoModel } from "../assign-branch/branch.model";

export enum ScanManage {
  SCANNED = "اسکن شده",
  PRIMARY_CONFIRMED = "تایید اولیه",
  PROCESSED = "پردازش شده",
  COMPLETED = "اتمام یافته",
}

@Component({
  selector: "app-manage-scanning",
  templateUrl: "./manage-scanning.component.html",
  styleUrls: ["./manage-scanning.component.scss"],
})
export class ManageScanningComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  documentSearchDto: DocumentSetModel = {};
  documentSets: DocumentSetModel[];
  documentData: DocumentSetModel[];
  page: number = 0;
  userList: ProfileDtoModel[];
  isLoading: boolean = false;
  typeKeys = Object.keys(ScanManage).map((key) => ({
    label: ScanManage[key],
    value: key,
  }));
  typeDocSetKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));
  selectedIds: number[] = [];
  selectedDoc: DocumentSetModel;
  content: any;
  imageURL: SafeUrl;
  branchName: string = "";
  selectedFile: FileContradictionModel;
  panelOpenState = false;
  resultCount: number = 0;
  isSearch: boolean = false;
  ordering: string = ",desc";
  userKeys: any[] = [];

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

  fileTypeLabel: any = "";
  typeDocLabel: any = "";
  statusLabel: any = "";
  branchLabel: any = "";
  userLabel: any = "";
  otherDocumentLabel: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private scanService: ScanService,
    private userService: UserService,
    private persianCalendarService: PersianCalendarService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.scanService.getAllFileTypeList().then((res) => {
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
      rowNumber: new FormControl(""),
      customerNumber: new FormControl(""),
      fileNumber: new FormControl(""),
      fileTypeId: new FormControl(""),
      otherDocumentTypeId: new FormControl(""),
      fileStatusId: new FormControl(""),
    });
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
    this.getAllUsers();

    this.roleName = localStorage.getItem("roleName");

    if (this.roleName === "ADMIN" || this.roleName === "DOA") {
      this.scanService
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
      this.scanService
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

  getAllDocumentSet() {
    this.isSearch = false;
    this.resultCount = null;
    this.scanService
      .getScanManagement(0, 10, "registerDate", ",desc")
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

  loadDocumentSets(event: LazyLoadEvent) {
    this.currentPage = event.first / 10;

    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.scanService
        .getScanManagement(0, 10, "registerDate", ",desc")
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
        ? (event.sortField = "registerDate")
        : event.sortField;
      if (event.sortOrder === 1) {
        this.ordering = ",desc";
      } else if (event.sortOrder === -1) {
        this.ordering = ",asc";
      }
      this.documentData = [];
      if (this.documentSets) {
        if (this.isSearch) {
          if (this.documentSearchDto.status == undefined) {
            this.documentSearchDto.status = [
              "PRIMARY_CONFIRMED",
              "SCANNED",
              "PROCESSED",
            ];
          }
          this.scanService
            .getAllDocumentSetWithSearch(
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
          this.scanService
            .getScanManagement(
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

  getAllUsers() {
    let obj = ["DOPU", "DOEU", "DOA"];

    this.userService
      .getOfficeUsers(obj)
      .then((res) => {
        this.userList = res;
        this.userList.forEach((k) => {
          this.userKeys.push({
            label: k.user.fullName,
            value: k.id,
          });
        });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  submitNew() {
    this.ngbModalRef.close();
    this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
  }

  openModalClick(content, selectedDoc?: DocumentSetModel) {
    this.selectedDoc = selectedDoc;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then(() => {
      this.passEntry.emit();
    });
  }

  openModalFileClick(content, selectedFile?: FileContradictionModel) {
    this.selectedFile = selectedFile;
    this.ngbModalRef = this.modalService.open(content, {
      windowClass: "my-class",
    });
    this.ngbModalRef.result.then(() => {});
  }

  closeModal() {
    this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
    this.modalService.dismissAll();
  }

  reScan(id) {
    swal
      .fire({
        title: "آیا بازخوانی مجدد فایل را تایید می کنید؟",
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
          this.scanService
            .reScan(id)
            .then(() => {
              this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
              this.toastr.success("بازخوانی مجدد با موفقیت انجام شد.");
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        }
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

  onSelectedItem(documentSetModel: DocumentSetModel) {
    const index = this.selectedIds.indexOf(documentSetModel.id, 0);
    if (index > -1) {
      this.selectedIds.splice(index, 1);
    } else {
      this.selectedIds.push(documentSetModel.id);
    }
  }

  search() {
    if (Object.keys(this.documentSearchDto).length !== 0) {
      if (this.documentSearchDto.status == undefined) {
        this.documentSearchDto.status = [
          "PRIMARY_CONFIRMED",
          "SCANNED",
          "PROCESSED",
        ];
      }
      this.isSearch = true;
      this.resultCount = null;
      this.scanService
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

  setState(event: any) {
    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto.status = [DocumentEnumUtil.getValue(event.value)];
      this.statusLabel = event.value.label;
    }
  }

  setType(event: any) {
    this.typeDocLabel = event.value.label;
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

  setRegisterUser(event: any) {
    this.userLabel = event.value.label;
    this.documentSearchDto.scannerId = event.value.value;
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
    this.documentSearchDto.status = [
      "PRIMARY_CONFIRMED",
      "SCANNED",
      "PROCESSED",
    ];
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));

    this.documentSearchDto.customerNumber = null;
    this.documentSearchDto.fileNumber = null;
    this.documentSearchDto.fileTypeId = null;
    this.documentSearchDto.otherDocumentTypeId = null;
    this.documentSearchDto.fileStatusId = null;
    this.otherDocumentType = [];
    this.fileStatusKeys = [];
    this.defaultFs = "";
    this.showOther = false;
  }

  setFileTypeId(event: any) {
    this.defaultFs = "";

    this.fileTypeLabel = event.value.label;

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
    this.otherDocumentLabel = event.value.label;

    this.documentSearchDto.otherDocumentTypeId = event.value.value;
  }

  setFileStatusId(event: any) {
    this.documentSearchDto.fileStatusId = event.value.value;
  }
}
