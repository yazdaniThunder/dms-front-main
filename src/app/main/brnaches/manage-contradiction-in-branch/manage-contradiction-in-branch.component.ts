import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "jalali-moment";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import { BranchDtoModel } from "../../documents/assign-branch/branch.model";
import { ManageDocumentService } from "../../service/manage-document.service";
import { ManageFileService } from "../../service/manage-file.service";
import { DocumentEnumUtil } from "../manage-document/document-enum.util";
import { DocumentSetStateEnum } from "../manage-document/document-set-state.enum";
import { DocumentSetTypeEnum } from "../manage-document/document-set-type.enum";
import { DocumentSetModel } from "../manage-document/document-set.model";
import { UserDtoModel } from "../manage-document/user.model";
import { ConflictModel } from "./conflict.model";
import { DocumentContradictionModel } from "./document-contradiction.model";
import { FileContradictionModel } from "./file-contradiction.model";
import { FixConflictModel } from "./fix-conflict.model";
import { StatusSetTypeEnum } from "./status-set-type.enum";

@Component({
  selector: "app-manage-contradiction-in-branch",
  templateUrl: "./manage-contradiction-in-branch.component.html",
  styleUrls: ["./manage-contradiction-in-branch.component.scss"],
})
export class ManageContradictionInBranchComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  public formGroup2: FormGroup;

  documentContradictionSets: DocumentContradictionModel[] = [];
  documenSetData: DocumentContradictionModel[];
  page: number = 0;
  fileContradictionSets: FileContradictionModel[];
  documentData: FileContradictionModel[];
  pageSet: number = 0;
  public description: string = "";
  idDoc: number;
  idFile: number;
  reason: string;
  fileConflictReason: string;
  conflictDate: string;
  selectedDoc: DocumentContradictionModel;
  selectedFile: FileContradictionModel;
  conflictId: string;
  selectedConflictModel: ConflictModel;
  branchName: string = "";
  resultDocumentSetCount: number = 0;
  resultDocumentCount: number = 0;
  reasons: string[] = [];
  ordering: string = ",desc";
  orderingDoc: string = ",desc";
  isFirstLoad: boolean = true;
  isFirstLoad2: boolean = true;

  panelOpenState = false;

  typeKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));

  documentSearchDto: DocumentSetModel = {};
  documentSearchDto2: DocumentSetModel = {};

  roleName: string;

  typeBranchKeys: any[] = [];

  branchContentDropDown: BranchDtoModel[];

  userList: UserDtoModel[];
  userKeys: any[] = [];

  isSearch: boolean = false;
  isSearch2: boolean = false;

  currentPage: number;
  currentPageFile: number;

  typeLabel: any = "";
  branchLabel: any = "";

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private persianCalendarService: PersianCalendarService,
    private manageDocumentService: ManageDocumentService,
    private manageFileService: ManageFileService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.documentSearchDto.status = ["CONFLICTING"];

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
    // this.getAllUsers();

    this.roleName = localStorage.getItem("roleName");

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

  getAllContradictionDocumentSet() {
    this.resultDocumentSetCount = null;
    this.manageDocumentService
      .getAllContradictionDocumentSet(0, 10, "registerDate", ",desc")
      .then((res: any) => {
        this.documentContradictionSets = res.content;
        this.documenSetData = res.content;
        this.resultDocumentSetCount = res.totalElements;
        this.page = res.page;
        res.map((item) => {
          this.reason = item.conflicts[0].conflictReasons[0].reason;
          this.idDoc = item.id;
          this.conflictDate = item.conflicts[0].registerDate;
        });
      });
  }

  setBranch(event: any) {
    this.documentSearchDto.branchIds = [event.value.value];
    this.branchLabel = event.value.label;
  }

  setType(event: any) {
    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto.type = DocumentEnumUtil.getValue(event.value);
      this.typeLabel = event.value.label;
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

  search() {
    if (Object.keys(this.documentSearchDto).length !== 0) {
      this.documentSearchDto.status = ["CONFLICTING"];

      this.isSearch = true;
      this.resultDocumentSetCount = null;
      this.manageDocumentService
        .getAllDocumentSetWithSearch(
          0,
          10,
          "registerDate",
          ",desc",
          this.documentSearchDto
        )
        .then((res: any) => {
          this.documentContradictionSets = res.content;
          this.documenSetData = res.content;
          this.page = res.page;
          this.resultDocumentSetCount = res.totalElements;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      this.isSearch = false;
      this.ngOnInit();
      this.getAllContradictionDocumentSet();
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
    this.documentSearchDto.status = ["CONFLICTING"];
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
  }

  loadDocumentSetSets(event: LazyLoadEvent) {
    this.currentPage = event.first / 10;

    if (this.isFirstLoad2) {
      this.isFirstLoad2 = false;
      this.manageDocumentService
        .getAllContradictionDocumentSet(0, 10, "registerDate", ",desc")
        .then((res: any) => {
          this.documentContradictionSets = res.content;
          this.documenSetData = res.content;
          this.resultDocumentSetCount = res.totalElements;
          this.page = res.page;
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
      this.documenSetData = [];
      if (this.documentContradictionSets) {
        if (this.isSearch) {
          this.documentSearchDto.status = ["CONFLICTING"];

          this.manageDocumentService
            .getAllDocumentSetWithSearch(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering,
              this.documentSearchDto
            )
            .then((res: any) => {
              this.documenSetData = res.content;
              this.resultDocumentSetCount = res.totalElements;
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        } else {
          this.manageDocumentService
            .getAllContradictionDocumentSet(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering
            )
            .then((res: any) => {
              this.documenSetData = res.content;
              this.resultDocumentSetCount = res.totalElements;
            });
        }
      }
    }
  }

  getAllContradictionFileSet() {
    this.manageFileService
      .getAllContradictionFileSet(0, 10, "registerDate", ",desc")
      .then((res: any) => {
        this.fileContradictionSets = res.content;
        this.documentData = res.content;
        this.pageSet = res.page;
        this.resultDocumentCount = res.totalElements;
        this.idFile = res["id"];
      });
  }

  loadDocumentSets(event: LazyLoadEvent) {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.manageFileService
        .getAllContradictionFileSet(0, 10, "registerDate", ",desc")
        .then((res: any) => {
          this.fileContradictionSets = res.content;
          this.documentData = res.content;
          this.pageSet = res.page;
          this.resultDocumentCount = res.totalElements;
          this.idFile = res["id"];
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
      if (this.fileContradictionSets) {
        if (this.isSearch2) {
          if (this.documentSearchDto2.status == undefined) {
            this.documentSearchDto2.status = ["CONFLICTING"];
          }
          this.manageFileService
            .getAllDocumentWithSearch(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering,
              this.documentSearchDto2
            )
            .then((res: any) => {
              this.documentData = res.content;
              this.resultDocumentCount = res.totalElements;
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        } else {
          this.manageFileService
            .getAllContradictionFileSet(
              event.first / 10,
              event.rows,
              event.sortField,
              this.orderingDoc
            )
            .then((res: any) => {
              this.documentData = res.content;
              this.resultDocumentCount = res.totalElements;
            });
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

  getStatus(type: StatusSetTypeEnum) {
    return StatusSetTypeEnum[type];
  }

  getState(type: DocumentSetStateEnum) {
    return DocumentSetStateEnum[type];
  }

  public submitFile(formValues: any) {
    let input: FixConflictModel = {
      description: formValues.description,
      documentId: this.selectedConflictModel.id,
    };
    this.manageFileService
      .fixConflictDocument(input)
      .then((res) => {
        this.loadDocumentSets({ first: this.currentPageFile * 10, rows: 10 });
        this.modalService.dismissAll();
        this.toastr.success("رفع مغایرت  با موفقیت انجام شد.");
        this.ngbModalRef.close();
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        this.ngbModalRef.close();
      });
  }

  submitNew(event?: any) {
    this.ngbModalRef.close();
    if (event && event != false) {
      this.loadDocumentSetSets({ first: this.currentPage * 10, rows: 10 });
    }
  }

  openModalClick(content, selectedDoc?: DocumentContradictionModel) {
    this.selectedDoc = selectedDoc;

    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  openModalClickShow(content, selectedDoc?: DocumentContradictionModel) {
    this.manageDocumentService.getDocumentSetById(selectedDoc.id);
    this.selectedDoc = selectedDoc;
    this.selectedDoc.state.seen = true;

    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  openModalFileClick(content, selectedFile?: FileContradictionModel) {
    this.selectedFile = selectedFile;
    this.selectedFile.state.seen = true;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }

  openModalContradiction(openModalContradictionDoc, item: any) {
    this.description = "";
    this.selectedConflictModel = item;
    this.openModalClick(openModalContradictionDoc);
    this.reasons = this.selectedConflictModel.conflicts[0].conflictReasons.map(
      (k) => k.reason
    );
    /////
  }

  resetSearchItems2() {
    this.isSearch2 = false;
    this.formGroup2.reset();
    this.documentSearchDto2 = {};
    this.documentSearchDto2.fromDate = null;
    this.documentSearchDto2.toDate = null;
    this.documentSearchDto2.status = ["CONFLICTING"];
    this.documentSearchDto2.registerFromDate = null;
    this.documentSearchDto2.registerToDate = null;
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
  }

  search2() {
    if (Object.keys(this.documentSearchDto2).length !== 0) {
      this.documentSearchDto2.status = ["CONFLICTING"];

      this.isSearch2 = true;
      this.resultDocumentCount = null;
      this.manageFileService
        .getAllDocumentWithSearch(
          0,
          10,
          "registerDate",
          ",desc",
          this.documentSearchDto2
        )
        .then((res: any) => {
          this.fileContradictionSets = res.content;
          this.documentData = res.content;
          this.pageSet = res.page;
          this.resultDocumentCount = res.totalElements;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      this.isSearch2 = false;
      this.ngOnInit();
      this.getAllContradictionFileSet();
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

  setState(event: any) {
    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto2.states = [DocumentEnumUtil.getValue(event.value)];
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
