import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import {
  DocumentSetTypeEnum,
  GeneralTypeEnum,
} from "../../brnaches/manage-document/document-set-type.enum";
import { UserModel } from "../../brnaches/manage-document/user.model";
import { ConflictReasonService } from "../../service/conflict-reason.service";
import { OtehrDocumentService } from "../../service/otherDocument.service";
import { UserService } from "../../service/user.service";
import { ConflictReasonModel } from "./conflict-reason.model";
import { ConflictSearchModel } from "./conflict-search.model";
import { DocumentReasonModel } from "./document-request.model";
import { FileTypeModel } from "./file-type.model";

@Component({
  selector: "app-basic-information",
  templateUrl: "./basic-information.component.html",
  styleUrls: ["./basic-information.component.scss"],
})
export class BasicInformationComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  selectedFile: ConflictReasonModel;
  selectedFiles: ConflictReasonModel[] = [];
  fileContradictionModel: ConflictReasonModel[];
  documentData: ConflictReasonModel[];

  selectedItem: DocumentReasonModel;
  selectedItems: DocumentReasonModel[] = [];
  documentReasonData: DocumentReasonModel[];
  documentReasonModel: DocumentReasonModel[];

  selectedOtherItem: FileTypeModel;
  selectedOtherItems: FileTypeModel[] = [];
  documentOtherData: FileTypeModel[];
  documentOtherModel: FileTypeModel[];

  panelOpenState = false;
  userList: UserModel[];
  typeKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));
  typeEnumKeys = Object.keys(GeneralTypeEnum).map((key) => ({
    label: GeneralTypeEnum[key],
    value: key,
  }));
  documentSearchDto: ConflictSearchModel = {};
  isSearch: boolean = false;
  resultCount: number = 0;
  resultCountReason: number = 0;
  resultCountOther: number = 0;

  ordering: string = ",desc";
  page: number = 0;
  pageReason: number = 0;
  pageOther: number = 0;

  checked: boolean = true;

  isFirstLoad: boolean = true;

  isFirstLoadDocument: boolean = true;

  isFirstLoadOtherDocument: boolean = true;

  currentPage: number;

  currentPageDocument: number;

  currentPageOtherDocument: number;

  userLabel: any = "";
  typeLabel: any = "";
  documentSetTypeLabel: any = "";

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private persianCalendarService: PersianCalendarService,
    private modalService: NgbModal,
    private conflictReasonService: ConflictReasonService,
    private otehrDocumentService: OtehrDocumentService
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      regDateFrom: new FormControl(""),
      regDateTo: new FormControl(""),
      documentSetType: new FormControl(""),
      userId: new FormControl(""),
      reason: new FormControl(""),
      type: new FormControl(""),
    });
    this.getAllUsers();
  }

  getAllUsers() {
    let obj = ["ADMIN", "DOA"];

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

  setRegisterUser(event: any) {
    this.documentSearchDto.userId = event.id;
    this.userLabel = event.fullName;
  }

  setType(event: any) {
    if (event.value === "ALL") {
      this.documentSearchDto.documentSetType = null;
    } else {
      this.documentSearchDto.documentSetType = event.value;
      this.documentSetTypeLabel = event.label;
    }
  }

  setGeneralType(event: any) {
    this.documentSearchDto.type = event.value;
    this.typeLabel = event.label;
  }

  setConflictFromDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.regDateFrom = convertedDate;
    } else {
      this.documentSearchDto.regDateFrom = null;
    }
  }

  setConflictToDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.regDateTo = convertedDate;
    } else {
      this.documentSearchDto.regDateTo = null;
    }
  }

  search() {
    if (Object.keys(this.documentSearchDto).length !== 0) {
      this.isSearch = true;
      this.resultCount = null;
      this.conflictReasonService
        .getAllConflictReasonWithSearch(
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
      this.getAllConflicts();
    }
  }

  resetSearchItems() {
    this.formGroup.reset();
    this.documentSearchDto.regDateFrom = null;
    this.documentSearchDto.regDateTo = null;
    this.documentSearchDto = {};
  }

  openModalFileClick(content, selectedFile?: ConflictReasonModel) {
    this.selectedFile = selectedFile;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }

  submitNew(event?: any) {
    this.ngbModalRef.close();
    if (event && event != false) {
      this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
    }
  }

  getAllConflicts() {
    this.isSearch = false;
    this.resultCount = null;
    this.conflictReasonService
      .getAllConflictReasons(0, 10, "registerDate", ",desc")
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

  loadDocumentSets(event: LazyLoadEvent) {
    this.currentPage = event.first / 10;
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.conflictReasonService
        .getAllConflictReasons(0, 10, "registerDate", ",desc")
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
          this.conflictReasonService
            .getAllConflictReasonWithSearch(
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
          this.conflictReasonService
            .getAllConflictReasons(
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

  getType(type: DocumentSetTypeEnum) {
    return DocumentSetTypeEnum[type];
  }

  getGeneralType(type: GeneralTypeEnum) {
    return GeneralTypeEnum[type];
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      return this.persianCalendarService.PersianCalendarNumericFormat(sendDate);
    }
  }

  deleteConflict(id) {
    swal
      .fire({
        title: "آیا حذف مغایرت را تایید میکنید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.conflictReasonService.deleteConflict(id).then(() => {
            this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
            this.toastr.success("حذف مغایرت با موفقیت انجام شد.");
            this.selectedFiles = [];
          });
        }
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  deleteSelectConflict() {
    swal
      .fire({
        title: "آیا حذف مغایرت را تایید میکنید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.conflictReasonService
            .deleteListConflict(this.selectedFiles.map((item) => item.id))
            .then(() => {
              this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
              this.toastr.success("حذف مغایرت با موفقیت انجام شد.");
              this.selectedFiles = [];
            });
        }
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  handleChange(activate, id) {
    let request = {
      reasonIds: [id],
      active: !!activate,
    };
    this.conflictReasonService.deActiveConflict(request).then(() => {
      this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
    });
  }

  openModalClick(content, selectedItem?: DocumentReasonModel) {
    this.selectedItem = selectedItem;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }

  submitNewRequest(event?: any) {
    this.ngbModalRef.close();
    if (event && event != false) {
      this.loadRequest({ first: this.currentPageDocument * 10, rows: 10 });
    }
  }

  loadRequest(event: LazyLoadEvent) {
    this.currentPageDocument = event.first / 10;
    if (this.isFirstLoadDocument) {
      this.isFirstLoadDocument = false;
      this.conflictReasonService
        .getAllDocumentReasons(0, 10, "registerDate", ",desc")
        .then((res: any) => {
          this.documentReasonData = res.content;
          this.documentReasonModel = res.content;
          this.resultCountReason = res.totalElements;
          this.pageReason = res.page;
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
      this.documentReasonData = [];

      if (this.documentReasonModel) {
        this.conflictReasonService
          .getAllDocumentReasons(
            event.first / 10,
            event.rows,
            event.sortField,
            this.ordering
          )
          .then((res: any) => {
            this.documentReasonData = res.content;
            this.resultCountReason = res.totalElements;
          })
          .catch(() => {
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
          });
      }
    }
  }

  handleChangeDocument(activate, id) {
    let request = {
      reasonIds: [id],
      active: !!activate,
    };
    this.conflictReasonService.deActiveDocument(request).then(() => {
      this.loadRequest({ first: this.currentPageDocument * 10, rows: 10 });
    });
  }

  handleChangeOtherDocument(activate, id) {
    let request = {
      reasonIds: [id],
      active: !!activate,
    };
    this.otehrDocumentService.deActiveOtherDocument(request).then(() => {
      this.loadOther({ first: this.currentPageOtherDocument * 10, rows: 10 });
    });
  }

  loadOther(event: LazyLoadEvent) {
    this.currentPageOtherDocument = event.first / 10;
    if (this.isFirstLoadOtherDocument) {
      this.isFirstLoadOtherDocument = false;
      this.otehrDocumentService
        .getAllFileType(0, 10, "id", ",desc")
        .then((res: any) => {
          this.documentOtherData = res.content;
          this.documentOtherModel = res.content;
          this.resultCountOther = res.totalElements;
          this.pageOther = res.page;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      event.sortField === undefined
        ? (event.sortField = "id")
        : event.sortField;
      if (event.sortOrder === 1) {
        this.ordering = ",desc";
      } else if (event.sortOrder === -1) {
        this.ordering = ",asc";
      }
      this.documentOtherData = [];

      if (this.documentReasonModel) {
        this.otehrDocumentService
          .getAllFileType(
            event.first / 10,
            event.rows,
            event.sortField,
            this.ordering
          )
          .then((res: any) => {
            this.documentOtherData = res.content;
            this.resultCountOther = res.totalElements;
          })
          .catch(() => {
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
          });
      }
    }
  }

  openModalOtherClick(content, selectedOtherItem?: FileTypeModel) {
    this.selectedOtherItem = selectedOtherItem;
    this.ngbModalRef = this.modalService.open(content, {
      windowClass: "my-class",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }

  submitOtherDocument(event?: any) {
    this.ngbModalRef.close();
    if (event && event != false) {
      this.loadOther({ first: this.currentPageOtherDocument * 10, rows: 10 });
    }
  }
}
