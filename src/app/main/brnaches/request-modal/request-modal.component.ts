import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Accordion } from "primeng/accordion";
import { BranchDtoModel } from "../../documents/assign-branch/branch.model";
import { DocumentReasonModel } from "../../documents/basic-information/document-request.model";
import { DocumentRequestService } from "../../service/document-request.service";
import { DocumentSetRequestTypeEnum } from "../manage-document/document-set-type.enum";
import { DocumentRequestModel } from "./document-request.model";

export enum RequestType {
  DOCUMENT_IMAGE = "تصویر سند",
  DOCUMENT_ORIGINAL = "اصل سند",
}

export enum RequestTypeAdmin {
  DOCUMENT_IMAGE = "تصویر سند",
  DOCUMENT_ORIGINAL = "اصل سند",
  GROUP_DOCUMENT_IMAGE = "تصویر سند گروهی",
}

@Component({
  selector: "app-request-modal",
  templateUrl: "./request-modal.component.html",
  styleUrls: ["./request-modal.component.scss"],
})
export class RequestModalComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  selectedType: any;
  enumKeys = Object.keys(DocumentSetRequestTypeEnum).map((key) => ({
    label: DocumentSetRequestTypeEnum[key],
    value: key,
  }));
  requestKeys = Object.keys(RequestType).map((key) => ({
    label: RequestType[key],
    value: key,
  }));
  requestKeysAdmin = Object.keys(RequestTypeAdmin).map((key) => ({
    label: RequestTypeAdmin[key],
    value: key,
  }));
  public formGroup: FormGroup;
  public documentSetModel: DocumentRequestModel = {};
  public requsetModel = new DocumentRequestModel();
  branchName: string = "";
  fullName: string = "";
  file: File = null;
  branchContent: BranchDtoModel[];
  typeKeys: any[] = [];
  reasonContent: DocumentReasonModel[];
  typeReasonKeys: any[] = [];

  requestTypeIs: boolean = false;
  documentTypeIs: boolean = false;
  fileNumberIs: boolean = false;
  documentNumberIs: boolean = false;
  documentDateIs: boolean = false;
  documentAmountIs: boolean = false;
  customerNumberIs: boolean = false;
  requestDescriptionIs: boolean = false;
  fileIs: boolean = false;
  branchIdIs: boolean = false;
  referenceTitleIs: boolean = false;

  roleName: string;

  typeLabel: any = "";
  reasonLabel: any = "";
  requestTypeLabel: any = "";
  branchLabel: any = "";

  @ViewChild("accordion", { static: false }) accordion: Accordion;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private documentRequestService: DocumentRequestService
  ) {}
  ngOnInit() {
    this.roleName = localStorage.getItem("roleName");

    this.formGroup = this.formBuilder.group({
      documentType: new FormControl("", [Validators.required]),
      documentDateFrom: new FormControl(""),
      documentAmount: new FormControl(""),
      documentDateTo: new FormControl(""),
      documentDate: new FormControl(""),
      branchCode: new FormControl(""),
      branchCodeRequested: new FormControl(""),
      requestDescription: new FormControl("", [Validators.required]),
      requestType: new FormControl("", [Validators.required]),
      customerNumber: new FormControl(""),
      documentNumber: new FormControl(""),
      fileNumber: new FormControl(""),
      file: new FormControl(""),
      viewValidateDate: new FormControl(""),
      user: new FormControl(""),
      reciveDescription: new FormControl(""),
      DocumentRequestReasonId: new FormControl("", [Validators.required]),
      checkNumber: new FormControl(""),
      checkReceiptDateFrom: new FormControl(""),
      checkReceiptDateTo: new FormControl(""),
      checkReceiptDate: new FormControl(""),
      checkIssuingBank: new FormControl(""),
      checkDate: new FormControl(""),
      fileDate: new FormControl(""),
      fileTitle: new FormControl(""),
      fileDateFrom: new FormControl(""),
      fileDateTo: new FormControl(""),
      referenceTitle: new FormControl(""),
    });
    this.branchName = localStorage
      .getItem("branchName")
      .concat("-" + localStorage.getItem("branchCode"));
    this.fullName = localStorage.getItem("fullName");
    this.getAllBranch();
    this.getAllReason();

    this.disableDropdown();
  }

  formatNumber() {
    this.requsetModel.documentAmount = parseFloat(
      this.requsetModel.documentAmount.toString().replace(/,/g, "")
    ).toLocaleString();
  }

  getAllBranch() {
    this.documentRequestService
      .getAllBranchesList()
      .then((res: any) => {
        this.branchContent = res;
        this.branchContent.forEach((k) => {
          this.typeKeys.push({
            label: k.branchName + "-" + k.branchCode,
            value: k.id,
          });
        });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  getAllReason() {
    this.documentRequestService
      .getAllReasonList()
      .then((res: any) => {
        this.reasonContent = res;
        this.reasonContent.forEach((k) => {
          this.typeReasonKeys.push({
            label: k.title,
            value: k.id,
            validation: k.requestReasonValidations.map((k) => k.fieldName),
          });
        });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  documentDateFrom(event: any) {
    this.requsetModel.documentDateFrom = event;
  }

  documentDateTo(event: any) {
    this.requsetModel.documentDateTo = event;
  }

  documentDate(event: any) {
    this.requsetModel.documentDate = event;
  }

  checkReceiptDateTo(event: any) {
    this.requsetModel.checkReceiptDateTo = event;
  }

  checkReceiptDateFrom(event: any) {
    this.requsetModel.checkReceiptDateFrom = event;
  }

  checkReceiptDate(event: any) {
    this.requsetModel.checkReceiptDate = event;
  }

  checkDate(event: any) {
    this.requsetModel.checkDate = event;
  }

  fileDate(event: any) {
    this.requsetModel.fileDate = event;
  }

  fileDateFrom(event: any) {
    this.requsetModel.fileDateFrom = event;
  }

  fileDateTo(event: any) {
    this.requsetModel.fileDateTo = event;
  }

  setType(event: any) {
    this.requsetModel.documentType = event.value.value;
    this.typeLabel = event.value.label;
    this.enableDropdown();
  }

  setRequest(event: any) {
    this.checkValidations(event);
    this.requsetModel.requestType = event.value.value;
  }

  enableDropdown() {
    this.formGroup.get("requestType").enable(); // To enable
  }

  disableDropdown() {
    this.formGroup.get("requestType").disable(); // To disable
  }

  setBranch(event: any) {
    this.requsetModel.branchId = event.value.value;
    this.branchLabel = event.value.label;
  }

  setReason(event: any) {
    event.value.validation.includes("branchId")
      ? (this.branchIdIs = true)
      : (this.branchIdIs = false);
    event.value.validation.includes("fileNumber")
      ? (this.fileNumberIs = true)
      : (this.fileNumberIs = false);
    event.value.validation.includes("documentNumber")
      ? (this.documentNumberIs = true)
      : (this.documentNumberIs = false);
    event.value.validation.includes("documentDate")
      ? (this.documentDateIs = true)
      : (this.documentDateIs = false);
    event.value.validation.includes("documentAmount")
      ? (this.documentAmountIs = true)
      : (this.documentAmountIs = false);
    event.value.validation.includes("customerNumber")
      ? (this.customerNumberIs = true)
      : (this.customerNumberIs = false);
    event.value.validation.includes("file")
      ? (this.fileIs = true)
      : (this.fileIs = false);
    event.value.validation.includes("referenceTitle")
      ? (this.referenceTitleIs = true)
      : (this.referenceTitleIs = false);

    this.requsetModel.DocumentRequestReasonId = event.value.value;
    this.reasonLabel = event.value.label;
  }

  cancel() {
    this.passEntry.emit(false);
  }

  private checkValidations(event: any) {
    let idx = event.value.value;
    this.clearAllValidators();

    if (
      this.requsetModel.documentType === "DAILY" &&
      idx === "GROUP_DOCUMENT_IMAGE"
    ) {
      this.formGroup.controls["branchCode"].setValidators([
        Validators.required,
      ]);
      this.formGroup.controls["branchCode"].updateValueAndValidity();
    }

    if (
      this.requsetModel.documentType === "DAILY" &&
      (idx === "DOCUMENT_ORIGINAL" || idx === "DOCUMENT_IMAGE")
    ) {
      this.formGroup.controls["documentNumber"].setValidators([
        Validators.required,
      ]);
      this.formGroup.controls["checkNumber"].setValidators([
        Validators.required,
      ]);
      this.formGroup.controls["documentAmount"].setValidators([
        Validators.required,
      ]);
      this.formGroup.controls["branchCode"].setValidators([
        Validators.required,
      ]);

      this.formGroup.controls["documentNumber"].updateValueAndValidity();
      this.formGroup.controls["checkNumber"].updateValueAndValidity();
      this.formGroup.controls["documentAmount"].updateValueAndValidity();
      this.formGroup.controls["branchCode"].updateValueAndValidity();
    }

    if (
      this.requsetModel.documentType === "CHAKAVAK" &&
      idx === "GROUP_DOCUMENT_IMAGE"
    ) {
      this.formGroup.controls["branchCode"].setValidators([
        Validators.required,
      ]);

      this.formGroup.controls["branchCode"].updateValueAndValidity();
    }

    if (
      this.requsetModel.documentType === "CHAKAVAK" &&
      (idx === "DOCUMENT_ORIGINAL" || idx === "DOCUMENT_IMAGE")
    ) {
      this.formGroup.controls["documentAmount"].setValidators([
        Validators.required,
      ]);
      this.formGroup.controls["branchCode"].setValidators([
        Validators.required,
      ]);
      this.formGroup.controls["checkIssuingBank"].setValidators([
        Validators.required,
      ]);
      this.formGroup.controls["checkNumber"].setValidators([
        Validators.required,
      ]);

      this.formGroup.controls["documentAmount"].updateValueAndValidity();
      this.formGroup.controls["branchCode"].updateValueAndValidity();
      this.formGroup.controls["checkIssuingBank"].updateValueAndValidity();
      this.formGroup.controls["checkNumber"].updateValueAndValidity();
    }

    if (
      this.requsetModel.documentType === "OTHER_BANKING_OPERATIONS" &&
      (idx === "DOCUMENT_ORIGINAL" || idx === "DOCUMENT_IMAGE")
    ) {
      this.formGroup.controls["customerNumber"].setValidators([
        Validators.required,
      ]);
      this.formGroup.controls["fileNumber"].setValidators([
        Validators.required,
      ]);
      this.formGroup.controls["fileTitle"].setValidators([Validators.required]);

      this.formGroup.controls["customerNumber"].updateValueAndValidity();
      this.formGroup.controls["fileNumber"].updateValueAndValidity();
      this.formGroup.controls["fileTitle"].updateValueAndValidity();
    }

    if (
      this.requsetModel.documentType === "OTHER_BANKING_OPERATIONS" &&
      idx === "GROUP_DOCUMENT_IMAGE"
    ) {
      this.formGroup.controls["branchCode"].setValidators([
        Validators.required,
      ]);

      this.formGroup.controls["branchCode"].updateValueAndValidity();
    }
  }

  clearAllValidators() {
    this.formGroup.controls["branchCode"].clearValidators();
    this.formGroup.controls["documentNumber"].clearValidators();
    this.formGroup.controls["checkNumber"].clearValidators();
    this.formGroup.controls["documentAmount"].clearValidators();
    this.formGroup.controls["checkIssuingBank"].clearValidators();
    this.formGroup.controls["customerNumber"].clearValidators();
    this.formGroup.controls["fileNumber"].clearValidators();
    this.formGroup.controls["fileTitle"].clearValidators();

    this.formGroup.controls["branchCode"].updateValueAndValidity();
    this.formGroup.controls["documentNumber"].updateValueAndValidity();
    this.formGroup.controls["checkNumber"].updateValueAndValidity();
    this.formGroup.controls["documentAmount"].updateValueAndValidity();
    this.formGroup.controls["checkIssuingBank"].updateValueAndValidity();
    this.formGroup.controls["customerNumber"].updateValueAndValidity();
    this.formGroup.controls["fileNumber"].updateValueAndValidity();
    this.formGroup.controls["fileTitle"].updateValueAndValidity();
  }

  onChange(event) {
    this.file = event.target.files[0];
  }

  public onSubmit() {
    let formdata = new FormData();
    if (this.file) {
      formdata.append("file", this.file, this.file.name);
    }
    if (this.requsetModel.requestDescription) {
      formdata.append(
        "requestDescription",
        this.requsetModel.requestDescription
      );
    }
    if (this.requsetModel.requestType) {
      formdata.append("requestType", this.requsetModel.requestType);
    }
    if (this.requsetModel.documentType) {
      formdata.append("documentType", this.requsetModel.documentType);
    }
    if (this.requsetModel.fileNumber) {
      formdata.append("fileNumber", this.requsetModel.fileNumber);
    }
    if (this.requsetModel.documentNumber) {
      formdata.append("documentNumber", this.requsetModel.documentNumber);
    }
    if (this.requsetModel.documentDateFrom) {
      formdata.append(
        "documentDateFrom",
        new Date(this.requsetModel.documentDateFrom).toISOString()
      );
    }
    if (this.requsetModel.documentDateTo) {
      formdata.append(
        "documentDateTo",
        new Date(this.requsetModel.documentDateTo).toISOString()
      );
    }
    if (this.requsetModel.documentDate) {
      formdata.append(
        "documentDate",
        new Date(this.requsetModel.documentDate).toISOString()
      );
    }
    if (this.requsetModel.documentAmount) {
      formdata.append(
        "documentAmount",
        this.requsetModel.documentAmount.replace(/,/g, "")
      );
    }
    if (this.requsetModel.customerNumber) {
      formdata.append("customerNumber", this.requsetModel.customerNumber);
    }
    if (this.requsetModel.branchId) {
      formdata.append("branchId", this.requsetModel.branchId);
    }
    if (this.requsetModel.DocumentRequestReasonId) {
      formdata.append(
        "documentRequestReasonId",
        this.requsetModel.DocumentRequestReasonId
      );
    }
    if (this.requsetModel.checkNumber) {
      formdata.append("checkNumber", this.requsetModel.checkNumber);
    }
    if (this.requsetModel.checkIssuingBank) {
      formdata.append("checkIssuingBank", this.requsetModel.checkIssuingBank);
    }
    if (this.requsetModel.checkDate) {
      formdata.append(
        "checkDate",
        new Date(this.requsetModel.checkDate).toISOString()
      );
    }
    if (this.requsetModel.checkReceiptDate) {
      formdata.append(
        "checkReceiptDate",
        new Date(this.requsetModel.checkReceiptDate).toISOString()
      );
    }
    if (this.requsetModel.checkReceiptDateFrom) {
      formdata.append(
        "checkReceiptDateFrom",
        new Date(this.requsetModel.checkReceiptDateFrom).toISOString()
      );
    }
    if (this.requsetModel.checkReceiptDateTo) {
      formdata.append(
        "checkReceiptDateTo",
        new Date(this.requsetModel.checkReceiptDateTo).toISOString()
      );
    }
    if (this.requsetModel.fileDate) {
      formdata.append(
        "fileDate",
        new Date(this.requsetModel.fileDate).toISOString()
      );
    }
    if (this.requsetModel.fileTitle) {
      formdata.append("fileTitle", this.requsetModel.fileTitle);
    }
    if (this.requsetModel.fileDateFrom) {
      formdata.append(
        "fileDateFrom",
        new Date(this.requsetModel.fileDateFrom).toISOString()
      );
    }
    if (this.requsetModel.fileDateTo) {
      formdata.append(
        "fileDateTo",
        new Date(this.requsetModel.fileDateTo).toISOString()
      );
    }
    if (this.requsetModel.referenceTitle) {
      formdata.append("referenceTitle", this.requsetModel.referenceTitle);
    }

    if (
      this.requsetModel.requestType === "GROUP_DOCUMENT_IMAGE" &&
      this.requsetModel.documentType === "DAILY" &&
      (this.requsetModel.documentDateFrom === undefined ||
        this.requsetModel.documentDateTo === undefined)
    ) {
      this.toastr.info("لطفا فیلد تاریخ را وارد کنید", "خطا");
    } else if (
      this.requsetModel.documentType === "DAILY" &&
      (this.requsetModel.requestType === "DOCUMENT_ORIGINAL" ||
        this.requsetModel.requestType === "DOCUMENT_IMAGE") &&
      this.requsetModel.documentDate === undefined
    ) {
      this.toastr.info("لطفا فیلد تاریخ ها را وارد کنید", "خطا");
    } else if (
      this.requsetModel.documentType === "CHAKAVAK" &&
      this.requsetModel.requestType === "GROUP_DOCUMENT_IMAGE" &&
      (this.requsetModel.checkReceiptDateFrom === undefined ||
        this.requsetModel.checkReceiptDateTo === undefined)
    ) {
      this.toastr.info("لطفا فیلد تاریخ ها را وارد کنید", "خطا");
    } else if (
      this.requsetModel.documentType === "CHAKAVAK" &&
      (this.requsetModel.requestType === "DOCUMENT_ORIGINAL" ||
        this.requsetModel.requestType === "DOCUMENT_IMAGE") &&
      (this.requsetModel.checkDate === undefined ||
        this.requsetModel.checkReceiptDate === undefined)
    ) {
      this.toastr.info("لطفا فیلد تاریخ ها را وارد کنید", "خطا");
    } else if (
      this.requsetModel.documentType === "OTHER_BANKING_OPERATIONS" &&
      (this.requsetModel.requestType === "DOCUMENT_ORIGINAL" ||
        this.requsetModel.requestType === "DOCUMENT_IMAGE") &&
      this.requsetModel.fileDate === undefined
    ) {
      this.toastr.info("لطفا فیلد تاریخ ها را وارد کنید", "خطا");
    } else if (
      this.requsetModel.documentType === "OTHER_BANKING_OPERATIONS" &&
      this.requsetModel.requestType === "GROUP_DOCUMENT_IMAGE" &&
      (this.requsetModel.fileDateFrom === undefined ||
        this.requsetModel.fileDateTo === undefined)
    ) {
      this.toastr.info("لطفا فیلد تاریخ ها را وارد کنید", "خطا");
    } else if (
      (this.fileNumberIs && this.requsetModel.fileNumber === undefined) ||
      (this.documentNumberIs &&
        this.requsetModel.documentNumber === undefined) ||
      (this.documentDateIs && this.requsetModel.documentDate === undefined) ||
      (this.documentAmountIs &&
        this.requsetModel.documentAmount === undefined) ||
      (this.customerNumberIs &&
        this.requsetModel.customerNumber === undefined) ||
      (this.branchIdIs && this.requsetModel.branchId === undefined) ||
      (this.referenceTitleIs && this.requsetModel.referenceTitle === undefined)
    ) {
      this.toastr.info("لطفا فیلدهای اجباری را وارد کنید", "خطا");
    } else if (this.fileIs && this.file === null) {
      this.toastr.info("لطفا فایل  را انتخاب کنید", "خطا");
    } else {
      this.documentRequestService
        .save(formdata)
        .then(() => {
          this.toastr.success("ثبت با موفقیت انجام شد.");
          this.passEntry.emit(true);
        })
        .catch((err) => {
          if (err.error.status === 403) {
            this.toastr.info("لطفا تمام فیلدها را به درستی وارد کنید!", "خطا");
          } else if (err.error.status === 400) {
            this.toastr.info("تاریخ از باید قبل از تاریخ تا باشد!", "خطا");
          } else {
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
            this.passEntry.emit(false);
          }
        });
    }
  }
}
