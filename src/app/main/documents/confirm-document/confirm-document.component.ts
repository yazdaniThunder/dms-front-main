import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "jalali-moment";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { FileContradictionModel } from "../../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { DocumentEnumUtil } from "../../brnaches/manage-document/document-enum.util";
import { DocumentStateEnum } from "../../brnaches/manage-document/document-set-state.enum";
import { DocumentSetTypeEnum } from "../../brnaches/manage-document/document-set-type.enum";
import { ProfileDtoModel } from "../../brnaches/manage-document/user.model";
import { ConfirmDocumentService } from "../../service/confirmDocument.service";
import { UserService } from "../../service/user.service";
import { BranchDtoModel } from "../assign-branch/branch.model";

export enum PrimaryAndConflict {
  CONFLICTING = "دارای مغایرت",
  PRIMARY_CONFIRMED = "تایید اولیه",
}

@Component({
  selector: "app-confirm-document",
  templateUrl: "./confirm-document.component.html",
  styleUrls: ["./confirm-document.component.scss"],
})
export class ConfirmDocumentComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  fileContradictionModel: FileContradictionModel[];
  documentData: FileContradictionModel[];
  selectedFileContradiction: FileContradictionModel[] = [];
  selectedFile: FileContradictionModel;
  panelOpenState = false;
  branchName: string = "";
  userList: ProfileDtoModel[];
  documentSearchDto: FileContradictionModel = {};
  typeKeys = Object.keys(PrimaryAndConflict).map((key) => ({
    label: PrimaryAndConflict[key],
    value: key,
  }));
  typeDocSetKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));
  resultCount: number = 0;
  page: number = 0;
  isSearch: boolean = false;
  ordering: string = ",desc";
  isFirstLoad: boolean = true;

  roleName: string;

  typeBranchKeys: any[] = [];

  branchContentDropDown: BranchDtoModel[];

  descriptionDoc: string = "";

  currentPage: number;

  userKeys: any[] = [];

  fileTypeKeys: any[] = [];
  fileStatusKeys: any[] = [];
  otherDocumentType: any[] = [];

  typeOfFile: any[] = [];

  showOther: boolean = false;
  defaultFs: any = "";

  otherDocumentTypeLabel: any = "";
  userLabel: any = "";
  stateLabel: any = "";
  typeLabel: any = "";
  branchTypeLabel: any = "";
  fileTypeLabel: any = "";

  constructor(
    private confirmDocumentService: ConfirmDocumentService,
    private persianCalendarService: PersianCalendarService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.confirmDocumentService.getAllFileTypeList().then((res) => {
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
      state: new FormControl(""),
      type: new FormControl(""),
      status: new FormControl(""),
      creator: new FormControl(""),
      acceptor: new FormControl(""),
      branchIds: new FormControl(""),
      documentNumber: new FormControl(""),
      maintenanceCode: new FormControl(""),
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
      this.confirmDocumentService
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

  getAllUsers() {
    let obj = ["DOEU", "DOPU", "DOA"];

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

  setBranch(event: any) {
    this.documentSearchDto.branchIds = [event.value.value];
    this.branchTypeLabel = event.value.label;
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

  setType(event: any) {
    this.documentSearchDto.states = [event.value.value];
    this.stateLabel = event.value.label;
  }

  setRegisterUser(event: any) {
    this.userLabel = event.value.label;
    this.documentSearchDto.scannerId = event.value.value;
  }

  setDocSetType(event: any) {
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

  getCheckedDocuments() {
    this.resultCount = null;
    this.isSearch = false;

    this.confirmDocumentService
      .primaryConfirmAndConflicted(0, 10, "registerDate", ",desc")
      .then((res: any) => {
        this.fileContradictionModel = res.content;
        this.documentData = res.content;
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

  getType(type: DocumentSetTypeEnum) {
    return DocumentSetTypeEnum[type];
  }

  getStatus(type: DocumentStateEnum) {
    return DocumentStateEnum[type];
  }

  loadDocumentSets(event: LazyLoadEvent) {
    this.currentPage = event.first / 10;

    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.confirmDocumentService
        .primaryConfirmAndConflicted(0, 10, "registerDate", ",desc")
        .then((res: any) => {
          this.fileContradictionModel = res.content;
          this.documentData = res.content;
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
          this.confirmDocumentService
            .getAllDocumentWithSearch(
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
          this.confirmDocumentService
            .primaryConfirmAndConflicted(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering
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
      this.confirmDocumentService
        .getAllDocumentWithSearch(
          0,
          10,
          "registerDate",
          ",desc",
          this.documentSearchDto
        )
        .then((res: any) => {
          this.fileContradictionModel = res.content;
          this.documentData = res.content;
          this.resultCount = res.totalElements;
          this.page = res.page;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      this.isSearch = false;
      this.ngOnInit();
      this.getCheckedDocuments();
    }
  }

  confirmDoc() {
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
          // let request = {
          //   ids: this.selectedFileContradiction.map((item) => item.id),
          //   operation: "confirm",
          // };
          this.confirmDocumentService
            .stagnateFile(this.selectedFileContradiction.map((item) => item.id))
            .then(() => {
              this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
              this.toastr.success("تائید  با موفقیت انجام شد.");
              this.selectedFileContradiction = [];
            });
        }
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  cancelDoc() {
    let request = {
      description: this.descriptionDoc,
      ids: this.selectedFileContradiction.map((item) => item.id),
      operation: "reject",
    };
    this.confirmDocumentService
      .acceptFile(request)
      .then(() => {
        this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
        this.toastr.success("عدم تائید با موفقیت انجام شد.");
        this.selectedFileContradiction = [];
        this.ngbModalRef.close();
        this.modalService.dismissAll();
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
    this.selectedFile = selectedFile;

    this.descriptionDoc = "";

    this.selectedFile.state.seen = true;

    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  resetSearchItems() {
    this.isSearch = false;
    // this.resultCount = null;
    this.formGroup.reset();
    this.documentSearchDto.fromDate = null;
    this.documentSearchDto.toDate = null;
    this.documentSearchDto.registerFromDate = null;
    this.documentSearchDto.registerToDate = null;
    this.documentSearchDto = {};
    this.documentSearchDto.states = ["CONFLICTING", "PRIMARY_CONFIRMED"];
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
    this.documentSearchDto.otherDocumentTypeId = event.value.value;
    this.otherDocumentTypeLabel = event.value.label;
  }

  setFileStatusId(event: any) {
    this.documentSearchDto.fileStatusId = event.value.value;
  }
}
