import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import swal from "sweetalert2";
import { DocumentModel } from "../../../data-tree/models/Document.model";
import { PersianCalendarService } from "../../../shared/services/persian-calendar.service";
import { OtherDocumentState } from "../../brnaches/manage-document/document-set-state.enum";
import { UserDtoModel } from "../../brnaches/manage-document/user.model";
import { BranchDtoModel } from "../../documents/assign-branch/branch.model";
import { OtehrDocumentService } from "../../service/otherDocument.service";
import { UserService } from "../../service/user.service";
import { OtherFileModel, OtherSearchModel } from "../other-file.model";

@Component({
  selector: "app-add-other-document",
  templateUrl: "./add-other-document.component.html",
  styleUrls: ["./add-other-document.component.scss"],
})
export class AddOtherDocumentComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private persianCalendarService: PersianCalendarService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private otehrDocumentService: OtehrDocumentService,
    private userService: UserService
  ) {}

  public formGroup: FormGroup;
  otherDocumentSearchDto: OtherSearchModel = {};
  private ngbModalRef: NgbModalRef;
  panelOpenState = false;
  @ViewChild("openModal", { static: true }) openModal;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  otherDocument: OtherFileModel[] = [];
  selectOtherDocument: OtherFileModel;
  resultOtherDocument: number = 0;
  otherDocumentData: OtherFileModel[];
  page: number = 0;
  ordering: string = ",desc";
  isSearch: boolean = false;
  currentPage: number;
  userList: UserDtoModel[];
  userKeys: any[] = [];
  fileTypeKeys: any[] = [];
  fileStatusKeys: any[] = [];
  otherDocumentType: any[] = [];
  typeOfFile: any[] = [];
  stateKeys = Object.keys(OtherDocumentState).map((key) => ({
    label: OtherDocumentState[key],
    value: key,
  }));
  branchName: string = "";
  roleName: string = "";
  itemsPerPage = 1500;
  currentPageItemsBranch: any[] = [];
  typeBranchKeys: any[] = [];
  branchContentDropDown: BranchDtoModel[];
  defaultFs: any = "";

  branchLabel: any = "";
  fileTypeLabel: any = "";
  otherDocumentTypeLabel: any = "";
  userLabel: any = "";
  stateLabel: any = "";

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      customerNumber: new FormControl(""),
      fileNumber: new FormControl(""),
      fileTypeId: new FormControl(""),
      otherDocumentTypeId: new FormControl(""),
      fileStatusId: new FormControl(""),
      registrarId: new FormControl(""),
      branchIds: new FormControl(""),
      state: new FormControl(""),
    });
    this.otehrDocumentService.getAllFileTypeList().then((res) => {
      this.typeOfFile = res;
      this.fileTypeKeys = this.typeOfFile.map((k) => ({
        label: k.title,
        value: k.title,
        id: k.id,
      }));
    });
    this.getAllUsers();
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-" + localStorage.getItem("branchName"));
    this.roleName = localStorage.getItem("roleName");

    if (this.roleName === "ADMIN") {
      this.otehrDocumentService
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

  onPageChangeBranch(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItemsBranch = this.typeBranchKeys.slice(
      startIndex,
      endIndex
    );
  }

  setRegisterFromDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.otherDocumentSearchDto.registerFromDate = convertedDate;
    } else {
      this.otherDocumentSearchDto.registerFromDate = null;
    }
  }

  setRegisterToDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.otherDocumentSearchDto.registerToDate = convertedDate;
    } else {
      this.otherDocumentSearchDto.registerToDate = null;
    }
  }

  setRegisterUser(event: any) {
    this.otherDocumentSearchDto.registrarId = event.value.value;
    this.userLabel = event.value.label;
  }

  setFileTypeId(event: any) {
    this.defaultFs = "";
    const selectedType = event.value.value;
    this.fileTypeLabel = event.value.label;

    this.otherDocumentSearchDto.fileTypeId = event.value.id;

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
    this.otherDocumentSearchDto.fileStatusId = this.defaultFs.value;
  }

  setOtherDocumentTypeId(event: any) {
    this.otherDocumentSearchDto.otherDocumentTypeId = event.value.value;
    this.otherDocumentTypeLabel = event.value.label;
  }

  setFileStatusId(event: any) {
    this.otherDocumentSearchDto.fileStatusId = event.value.value;
  }

  setState(event: any) {
    this.otherDocumentSearchDto.state = event.value.value;
    this.stateLabel= event.value.label;
  }

  submitNew(event?: any) {
    if (event == "file") {
      this.loadOtherDocument({
        first: this.currentPage * 10,
        rows: 10,
      });
    } else {
      this.ngbModalRef.close();
      if (event && event != false) {
        this.loadOtherDocument({ first: this.currentPage * 10, rows: 10 });
      }
    }
  }

  setBranch(event: any) {
    this.otherDocumentSearchDto.branchIds = [event.value.value];
    this.branchLabel = event.value.label;
  }

  resetSearchItems() {
    this.isSearch = false;
    this.formGroup.reset();
    this.otherDocumentSearchDto = {};
    this.otherDocumentSearchDto.registerToDate = null;
    this.otherDocumentSearchDto.customerNumber = null;
    this.otherDocumentSearchDto.fileNumber = null;
    this.otherDocumentSearchDto.fileTypeId = null;
    this.otherDocumentSearchDto.otherDocumentTypeId = null;
    this.otherDocumentSearchDto.fileStatusId = null;
    this.otherDocumentSearchDto.registrarId = null;
    this.otherDocumentSearchDto.branchIds = null;
    this.otherDocumentSearchDto.registerFromDate = null;
    this.defaultFs = "";
    this.otherDocumentType = [];
    this.fileStatusKeys = [];
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
  }

  getUploadedDoc(event: DocumentModel) {
    const split = event.path.split("/", 10);
    event.title = split[split.length - 1];
    this.modalService.dismissAll();
  }

  search() {
    if (Object.keys(this.otherDocumentSearchDto).length !== 0) {
      this.isSearch = true;
      this.resultOtherDocument = null;
      this.otehrDocumentService
        .getAllOtherSearch(
          0,
          10,
          "registerDate",
          ",desc",
          this.otherDocumentSearchDto
        )
        .then((res: any) => {
          this.otherDocument = res.content;
          this.otherDocumentData = res.content;
          this.page = res.page;
          this.resultOtherDocument = res.totalElements;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      this.isSearch = false;
      this.ngOnInit();
      this.getAllOtherDocument();
    }
  }

  getAllOtherDocument() {
    this.resultOtherDocument = null;

    this.otehrDocumentService
      .getAllOtherSearch(0, 10, "registerDate", ",desc", {})
      .then((res: any) => {
        this.otherDocument = res.content;
        this.otherDocumentData = res.content;
        this.resultOtherDocument = res.totalElements;
        this.page = res.page;
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  loadOtherDocument(event: LazyLoadEvent) {
    this.currentPage = event.first / 10;

    event.sortField === undefined
      ? (event.sortField = "registerDate")
      : event.sortField;
    if (event.sortOrder === 1) {
      this.ordering = ",desc";
    } else if (event.sortOrder === -1) {
      this.ordering = ",asc";
    }
    this.otherDocumentData = [];
    if (this.otherDocument) {
      if (this.isSearch) {
        this.otehrDocumentService
          .getAllOtherSearch(
            event.first / 10,
            event.rows,
            event.sortField,
            this.ordering,
            this.otherDocumentSearchDto
          )
          .then((res: any) => {
            this.otherDocumentData = res.content;
          })
          .catch(() =>
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
          );
      } else {
        this.otehrDocumentService
          .getAllOtherSearch(
            event.first / 10,
            event.rows,
            event.sortField,
            this.ordering,
            {}
          )
          .then((res: any) => {
            this.otherDocumentData = res.content;
            this.otherDocument = res.content;
            this.resultOtherDocument = res.totalElements;
            this.page = res.page;
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
  getState(state: OtherDocumentState) {
    return OtherDocumentState[state];
  }

  openModalFileClick(content, selectOtherDocument?: OtherFileModel) {
    this.selectOtherDocument = selectOtherDocument;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  deleteOtherDocument(id) {
    swal
      .fire({
        title: "آیا از حذف سایر اسناد اطمینان دارید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله تایید کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.otehrDocumentService.deleteOtherDocument(id).then(() => {
            this.toastr.success(" حذف سایر اسناد با موفقیت انجام شد.");
            this.loadOtherDocument({ first: this.currentPage * 10, rows: 10 });
            this.passEntry.emit();
          });
        }
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  sendOtherDocument(id) {
    swal
      .fire({
        title: "آیا از ارسال سایر اسناد اطمینان دارید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله ارسال کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.otehrDocumentService.sendOtherDocument(id).then(() => {
            this.toastr.success(" ارسال سایر اسناد با موفقیت انجام شد.");
            this.loadOtherDocument({
              first: this.currentPage * 10,
              rows: 10,
            });
            this.passEntry.emit();
          });
        }
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }
}
