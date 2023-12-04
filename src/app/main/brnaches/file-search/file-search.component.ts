import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "jalali-moment";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { BranchDtoModel } from "../../documents/assign-branch/branch.model";
import { ManageDocumentService } from "../../service/manage-document.service";
import { FileContradictionModel } from "../manage-contradiction-in-branch/file-contradiction.model";
import { DocumentEnumUtil } from "../manage-document/document-enum.util";
import { DocumentStateEnum } from "../manage-document/document-set-state.enum";
import { DocumentSetTypeEnum } from "../manage-document/document-set-type.enum";
import { DocumentSetModel } from "../manage-document/document-set.model";

@Component({
  selector: "app-file-search",
  templateUrl: "./file-search.component.html",
  styleUrls: ["./file-search.component.scss"],
})
export class FileSearchComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  documentSearchDto: DocumentSetModel = {};
  documentSets: DocumentSetModel[];
  isLoading: boolean = false;

  typeKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));
  statusKeys = Object.keys(DocumentStateEnum).map((key) => ({
    label: DocumentStateEnum[key],
    value: key,
  }));

  selectedFile: FileContradictionModel;

  selectedIds: number[] = [];
  selectedDoc: DocumentSetModel;
  content: any;
  imageURL: SafeUrl;
  branchName: string = "";
  panelOpenState = false;
  resultCount: number = 0;
  documentData: DocumentSetModel[];
  page: number = 0;
  isSearch: boolean = false;
  ordering: string = ",desc";

  docdate: any[] = [];
  docnumber: any[] = [];
  docclass: string = "";
  documentType: string = "";
  docbranchcode: any[] = [];
  documentDescription: string = "";

  open: boolean = false;
  link: string;

  fileUrl: SafeUrl;

  typeFile: string;

  isFirstLoad: boolean = true;

  roleName: string;

  typeBranchKeys: any[] = [];

  branchContentDropDown: BranchDtoModel[];

  fileTypeKeys: any[] = [];
  fileStatusKeys: any[] = [];
  otherDocumentType: any[] = [];

  typeOfFile: any[] = [];

  defaultFs: any = "";

  fileTypeLabel: any = "";
  stateLabel: any = "";
  branchLabel: any = "";
  otherDocumentTypeLabel: any = "";
  
  constructor(
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private persianCalendarService: PersianCalendarService,
    private manageDocumentService: ManageDocumentService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
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
      state: new FormControl(""),
      creator: new FormControl(""),
      acceptor: new FormControl(""),
      branchIds: new FormControl(""),
      filename: new FormControl(""),
      documentNumber: new FormControl(""),
      maintenanceCode: new FormControl(""),
      documentDate: new FormControl(""),
      customerNumber: new FormControl(""),
      fileNumber: new FormControl(""),
      fileTypeId: new FormControl(""),
      otherDocumentTypeId: new FormControl(""),
      fileStatusId: new FormControl(""),
    });
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));

    this.roleName = localStorage.getItem("roleName");

    if (
      this.roleName === "ADMIN" ||
      this.roleName === "DOA" ||
      this.roleName === "RU"
    ) {
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
    if (this.roleName === "DOEU" || this.roleName === "DOPU") {
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

  getAllDocumentSet() {
    this.resultCount = null;
    this.isSearch = false;
    this.manageDocumentService
      .getAllDocumentWithSearch(0, 10, "registerDate", ",desc", {})
      .then((res: any) => {
        this.documentSets = res.content;
        this.documentData = res.content;
        this.resultCount = res.totalElements;
        this.page = res.page;
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  loadDocumentSets(event: LazyLoadEvent) {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;

      this.manageDocumentService
        .getAllDocumentWithSearch(0, 10, "registerDate", ",desc", {})
        .then((res: any) => {
          this.documentSets = res.content;
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
      if (this.documentSets) {
        if (this.isSearch) {
          this.manageDocumentService
            .getAllDocumentWithSearch(
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
            .getAllDocumentWithSearch(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering,
              {}
            )
            .then((res: any) => {
              this.documentData = res.content;
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        }
      }
    }
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
      .getExcelDocumentById(this.documentSearchDto)
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

  getType(type: DocumentSetTypeEnum) {
    return DocumentSetTypeEnum[type];
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
        .getAllDocumentWithSearch(
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
    }
  }

  setState(event: any) {
    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto.states = [DocumentEnumUtil.getValue(event.value)];
      this.stateLabel = event.value.label;
    }
  }

  setRegisterUser(event: any) {
    this.documentSearchDto.registrarId = event.value.id;
  }

  setConfirmUser(event: any) {
    this.documentSearchDto.confirmerId = event.value.id;
  }

  resetSearchItems() {
    this.isSearch = false;
    this.formGroup.reset();
    this.documentSearchDto = {};
    this.documentSearchDto.fromDate = null;
    this.documentSearchDto.toDate = null;
    this.documentSearchDto.registerFromDate = null;
    this.documentSearchDto.registerToDate = null;
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
  }

  public onAdditionalDownload(id: string): void {
    this.link = null;
    this.open = false;
    this.manageDocumentService
      .showContent(id)
      .pipe()
      .subscribe((response) => {
        this.fileUrl = response.url;

        // let FileName = response.headers.get("content-disposition");
        let blob: Blob = response.body as Blob;
        let a = document.createElement("a");
        // a.download = FileName;
        a.href = window.URL.createObjectURL(blob);
        this.link = a.href;
        // a.click();
        this.open = true;
      });
  }

  openModalShowClick(content, selectedFile?: FileContradictionModel) {
    this.selectedFile = selectedFile;
    this.selectedFile.state.seen = true;
    this.manageDocumentService.getDocById(selectedFile.id);
    this.onAdditionalDownload(this.selectedFile.fileUuid);

    this.docnumber = [];
    this.docbranchcode = [];
    this.docdate = [];
    this.docclass = "";
    this.documentDescription = "";

    Promise.all(
      selectedFile.file.properties.map((item) => {
        if (item.name === "documentNo") {
          this.docnumber = item.value
            .trim()
            .slice(1, -1)
            .split(",")
            .map((element: any) => String(element.trim().replaceAll(`"`, " ")))
            .filter((element) => element !== null && element !== "");
        }
        if (item.name === "date") {
          this.docdate = item.value
            .trim()
            .slice(1, -1)
            .split(",")
            .map((element: any) => String(element.trim().replaceAll(`"`, " ")))
            .filter((element) => element !== null && element !== "");
        }
        if (item.name === "documentClass") {
          this.docclass = item.value;
        }

        if (item.name === "documentType") {
          this.documentType = item.value;
        }

        if (item.name === "documentDescription") {
          this.documentDescription = item.value;
        }
        if (item.name === "branchCode") {
          this.docbranchcode = item.value
            .trim()
            .slice(1, -1)
            .split(",")
            .map((element: any) => String(element.trim().replaceAll(`"`, " ")))
            .filter((element) => element !== null && element !== "");
        }
      })
    ).then(() => {
      this.ngbModalRef = this.modalService.open(content, {
        size: "lg",
        backdrop: "static",
      });
      this.ngbModalRef.result.then((result) => {});
    });
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
    this.documentSearchDto.otherDocumentTypeId = event.value.value;
    this.otherDocumentTypeLabel = event.value.label;
  }

  setFileStatusId(event: any) {
    this.documentSearchDto.fileStatusId = event.value.value;
  }
}
