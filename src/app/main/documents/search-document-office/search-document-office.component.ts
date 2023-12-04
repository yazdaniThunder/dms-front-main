import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import swal from "sweetalert2";
import { PersianCalendarService } from "../../../shared/services/persian-calendar.service";
import { DocumentEnumUtil } from "../../brnaches/manage-document/document-enum.util";
import { DocumentSetStateEnum } from "../../brnaches/manage-document/document-set-state.enum";
import { DocumentSetTypeEnum } from "../../brnaches/manage-document/document-set-type.enum";
import { DocumentSetModel } from "../../brnaches/manage-document/document-set.model";
import { UserModel } from "../../brnaches/manage-document/user.model";
import { ManageDocumentService } from "../../service/manage-document.service";
import { UserService } from "../../service/user.service";
import { BranchDtoModel } from "../assign-branch/branch.model";
@Component({
  selector: "app-search-document-office",
  templateUrl: "./search-document-office.component.html",
  styleUrls: ["./search-document-office.component.scss"],
})
export class SearchDocumentOfficeComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  documentSearchDto: DocumentSetModel = {};
  documentSets: DocumentSetModel[];
  documentSetData: DocumentSetModel[];
  page: number = 0;
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

  isSearch: boolean = false;

  selectedIds: number[] = [];
  selectedDoc: DocumentSetModel;
  content: any;
  imageURL: SafeUrl;
  panelOpenState = false;
  resultCount: number = 0;
  ordering: string = ",desc";

  branchContent: BranchDtoModel[];
  branchContentData: BranchDtoModel[];
  branchContentDropDown: BranchDtoModel[];
  typeBranchKeys: any[] = [];

  roleName: string;

  fileTypeKeys: any[] = [];
  fileStatusKeys: any[] = [];
  otherDocumentType: any[] = [];

  typeOfFile: any[] = [];

  showOther: boolean = false;
  defaultFs: any = "";

  fileTypeLabel: any = "";
  typeLabel: any = "";
  statusLabel: any = "";
  userLabel: any = "";
  usersLabel: any = "";
  branchLabel: any = "";
  otherDocumentTypeLabel: any = "";

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
    this.roleName = localStorage.getItem("roleName");
    this.manageDocumentService.getAllFileTypeList().then((res) => {
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
      customerNumber: new FormControl(""),
      fileNumber: new FormControl(""),
      fileTypeId: new FormControl(""),
      otherDocumentTypeId: new FormControl(""),
      fileStatusId: new FormControl(""),
    });

    this.getAllDocumentSet();
    this.getAllUsers();
    if (this.roleName === "DOPU" || this.roleName === "DOEU") {
      this.manageDocumentService
        .getAllBranchesAssignList()
        .then((res: any) => {
          this.branchContentDropDown = res;
          this.branchContentDropDown.forEach((k) => {
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
    } else {
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
          this.onPageChange({ first: 0, rows: this.itemsPerPage });
        })
        .catch(() => {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
    }
  }

  currentPageItems: any[] = [];
  itemsPerPage = 1500; // Number of items to display per page

  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItems = this.typeBranchKeys.slice(startIndex, endIndex);
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

  setBranch(event: any) {
    this.documentSearchDto.branchIds = [event.value.value];
    this.branchLabel = event.value.label;
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
      .getAllDocumentSetWithSearch(0, 10, "registerDate", ",desc", {})
      .then((res: any) => {
        this.documentSets = res.content;
        this.resultCount = res.totalElements;
        this.page = res.page;
        this.documentSetData = res.content;
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  loadDocumentSets(event: LazyLoadEvent) {
    event.sortField === undefined
      ? (event.sortField = "registerDate")
      : event.sortField;
    if (event.sortOrder === 1) {
      this.ordering = ",desc";
    } else if (event.sortOrder === -1) {
      this.ordering = ",asc";
    }
    this.documentSetData = [];
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
            this.documentSetData = res.content;
          })
          .catch(() =>
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
          );
      } else {
        this.manageDocumentService
          .getAllDocumentSetWithSearch(
            event.first / 10,
            event.rows,
            event.sortField,
            this.ordering,
            {}
          )
          .then((res: any) => {
            this.documentSetData = res.content;
          })
          .catch(() =>
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
          );
      }
    }
  }

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
        this.onPageChange2({ first: 0, rows: this.itemsPerPage });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  currentPageItemsUser: any[] = [];
  currentPageItemsUser2: any[] = [];

  onPageChange2(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItemsUser2 = this.userList2.slice(startIndex, endIndex);
  }

  onPageChangeUser(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItemsUser = this.userList.slice(startIndex, endIndex);
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
        confirmButtonText: "!بله تایید کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.manageDocumentService
            .deleteDocumentSetById(this.selectedIds)
            .then((res) => {
              this.getAllDocumentSet();
              this.selectedIds = [];
              this.toastr.success("حذف دسته اسناد با موفقیت انجام شد.");
            });
        }
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  addDocumentSet() {
    swal
      .fire({
        title: "آیا حذف دسته اسناد انتخاب شده را تایید می کنید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        inputPlaceholder: "حذف کنید",
        confirmButtonText: "!بله تایید کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.manageDocumentService
            .deleteDocumentSetById(this.selectedIds)
            .then((res) => {
              this.getAllDocumentSet();
              this.selectedIds = [];
              this.toastr.success("حذف دسته اسناد با موفقیت انجام شد.");
            });
        }
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
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

  submitNew() {
    this.getAllDocumentSet();
    this.ngbModalRef.close();
  }

  openModalClick(content, selectedDoc?: DocumentSetModel) {
    this.selectedDoc = selectedDoc;
    this.selectedDoc.state.seen = true;
    this.manageDocumentService.getDocumentSetById(selectedDoc.id);

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
      var someDate = new Date(sendDate);
      return this.persianCalendarService.PersianCalendarNumeric(someDate);
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
          this.documentSetData = res.content;
          this.page = res.page;
          this.resultCount = res.totalElements;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      this.isSearch = false;
      this.ngOnInit();
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
    this.usersLabel = event.value.fullName;
  }

  resetSearchItems() {
    this.isSearch = false;
    this.resultCount = null;
    this.formGroup.reset();
    this.documentSearchDto = {};
    this.documentSearchDto.fromDate = null;
    this.documentSearchDto.toDate = null;
    this.documentSearchDto.registerFromDate = null;
    this.documentSearchDto.registerToDate = null;
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
