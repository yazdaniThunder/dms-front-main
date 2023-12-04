import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { DocumentEnumUtil } from "../../brnaches/manage-document/document-enum.util";
import { DocumentSetStateEnum } from "../../brnaches/manage-document/document-set-state.enum";
import { DocumentSetTypeEnum } from "../../brnaches/manage-document/document-set-type.enum";
import { DocumentSetModel } from "../../brnaches/manage-document/document-set.model";
import { UserDtoModel } from "../../brnaches/manage-document/user.model";
import { ManageCheckingService } from "../../service/manageChecking.service";
import { UserService } from "../../service/user.service";
import { BranchDtoModel } from "../assign-branch/branch.model";
import { ConfirmStateModel } from "./confirm-state.model";

@Component({
  selector: "app-manage-checking",
  templateUrl: "./manage-checking.component.html",
  styleUrls: ["./manage-checking.component.scss"],
})
export class ManageCheckingComponent implements OnInit {
  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;

  confirmStateModel: ConfirmStateModel[] = [];
  documentSetData: ConfirmStateModel[];
  selectedConfirmStates: ConfirmStateModel[] = [];
  selectedDoc: ConfirmStateModel;
  resultCount: number = 0;
  page: number = 0;
  ordering: string = ",desc";
  branchName: string = "";
  panelOpenState = false;

  isFirstLoad: boolean = true;

  typeKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));

  documentSearchDto: DocumentSetModel = {};

  roleName: string;

  typeBranchKeys: any[] = [];

  branchContentDropDown: BranchDtoModel[];

  userList: UserDtoModel[];
  userKeys: any[] = [];

  isSearch: boolean = false;

  currentPage: number;
  fileTypeKeys: any[] = [];
  fileStatusKeys: any[] = [];
  otherDocumentType: any[] = [];

  typeOfFile: any[] = [];

  showOther: boolean = false;
  defaultFs: any = "";

  otherDocumentTypeLabel: any = "";
  statusLabel: any = "";
  branchLabel: any = "";
  userLabel: any = "";
  typeLabel: any = "";
  fileTypeLabel: any = "";

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    private manageCheckingService: ManageCheckingService,
    private persianCalendarService: PersianCalendarService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.documentSearchDto.status = ["BRANCH_CONFIRMED"];

    this.manageCheckingService.getAllFileTypeList().then((res) => {
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
      registrarId: new FormControl(""),
      branchIds: new FormControl(""),
      rowNumber: new FormControl(""),
      creator: new FormControl(""),
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
      this.manageCheckingService
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

    if (this.roleName === "DOEU" || this.roleName === "DOPU") {
      this.manageCheckingService
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

  getAllUsers() {
    this.userService
      .getConfirmer()
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

  setRegisterUser(event: any) {
    this.userLabel = event.value.label;
    this.documentSearchDto.confirmerId = event.value.value;
  }

  search() {
    if (Object.keys(this.documentSearchDto).length !== 0) {
      this.documentSearchDto.status = ["BRANCH_CONFIRMED"];

      this.isSearch = true;
      this.resultCount = null;
      this.manageCheckingService
        .getAllDocumentSetWithSearch(
          0,
          10,
          "registerDate",
          ",desc",
          this.documentSearchDto
        )
        .then((res: any) => {
          this.confirmStateModel = res.content;
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
      this.getBranchConfirmState();
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
    this.documentSearchDto.status = ["BRANCH_CONFIRMED"];
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
    this.defaultFs = "";
    this.documentSearchDto.customerNumber = null;
    this.documentSearchDto.fileNumber = null;
    this.documentSearchDto.fileTypeId = null;
    this.documentSearchDto.otherDocumentTypeId = null;
    this.documentSearchDto.fileStatusId = null;
    this.otherDocumentType = [];
    this.fileStatusKeys = [];
    this.showOther = false;
  }

  submitNew(event?: any) {
    this.ngbModalRef.close();
    if (event && event != false) {
      this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });
    }
  }

  getBranchConfirmState() {
    this.resultCount = null;
    this.manageCheckingService
      .getBranchConfirmState(0, 10, "registerDate", ",desc")
      .then((res: any) => {
        this.confirmStateModel = res.content;
        this.documentSetData = res.content;
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
      this.manageCheckingService
        .getBranchConfirmState(0, 10, "registerDate", ",desc")
        .then((res: any) => {
          this.confirmStateModel = res.content;
          this.documentSetData = res.content;
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
      this.documentSetData = [];
      //imitate db connection over a network
      if (this.confirmStateModel) {
        if (this.isSearch) {
          this.documentSearchDto.status = ["BRANCH_CONFIRMED"];

          this.manageCheckingService
            .getAllDocumentSetWithSearch(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering,
              this.documentSearchDto
            )
            .then((res: any) => {
              this.documentSetData = res.content;
              this.resultCount = res.totalElements;
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        } else {
          this.manageCheckingService
            .getBranchConfirmState(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering
            )
            .then((res: any) => {
              this.documentSetData = res.content;
              this.resultCount = res.totalElements;
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        }
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

  openModalClick(content: any, selectedDoc?: ConfirmStateModel) {
    this.selectedDoc = selectedDoc;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }

  confirmDoc() {
    swal
      .fire({
        title: "آیا از تائید اولیه دسته اسناد اطمینان دارید؟",
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
            ids: this.selectedConfirmStates.map((item) => item.id),
            operation: "confirm",
          };
          this.manageCheckingService.acceptDocument(request).then(() => {
            this.loadDocumentSets({ first: this.currentPage * 10, rows: 10 });

            this.toastr.success("تائید اسناد با موفقیت انجام شد.");
            this.selectedConfirmStates = [];
          });
        }
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
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
    this.otherDocumentTypeLabel = event.value.label;
    this.documentSearchDto.otherDocumentTypeId = event.value.value;
  }

  setFileStatusId(event: any) {
    this.statusLabel = event.value.label;
    this.documentSearchDto.fileStatusId = event.value.value;
  }
}
