import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material";
import { SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Accordion } from "primeng/accordion";
import { OtpInputComponent } from "src/app/shared/otp-input/otp-input.component";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { PersianDatePickerComponent } from "../../../shared/components/persian-date-picker/persian-date-picker.component";
import { FileContradictionModel } from "../../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { PropDocModel } from "../../brnaches/manage-contradiction-in-branch/prop-doc.model";
import { DocumentEnumUtil } from "../../brnaches/manage-document/document-enum.util";
import {
  DocumentStateAllEnum,
  DocumentStateEnum,
} from "../../brnaches/manage-document/document-set-state.enum";
import {
  DocumentSetOtherTypeEnum,
  DocumentSetTypeEnum,
  FileTypeEnum,
} from "../../brnaches/manage-document/document-set-type.enum";
import { ManageDocumentService } from "../../service/manage-document.service";
import { ManageFileService } from "../../service/manage-file.service";
import { ConfirmStateModel } from "../manage-checking/confirm-state.model";
import { BankListEnum } from "./banksList";

export enum TransactionTypeEnum {
  "نقدی" = "نقدی",
  "انتقالی" = "انتقالی",
  "انتقال وجه از طریق سحاب" = "انتقال وجه از طریق سحاب",
  "صورت جلسه آمار ارزی" = "صورت جلسه آمار ارزی",
  "صورت جلسه رسیدگی اسناد پایان روز" = "صورت جلسه رسیدگی اسناد پایان روز",
  "روزنامه پایان روز کاربر" = "روزنامه پایان روز کاربر",
  "روزنامه کلی شعبه" = "روزنامه کلی شعبه",
}

export enum TransactionTypeChakavakEnum {
  "چک عادی" = "چک عادی",
  "چک بانکی" = "چک بانکی",
  "چک بین بانکی (رمزدار)" = "چک بین بانکی (رمزدار)",
}

export enum TypeOfDocEnum0 {
  "فرم دستور وصول چک" = "فرم دستور وصول چک",
}

export enum TypeOfDocEnum1 {
  "فرم دستور وصول چک" = "فرم دستور وصول چک",
  "برگ چک عهده سایر بانک ها" = "برگ چک عهده سایر بانک ها",
}

export enum TypeOfDocEnum2 {
  "فرم دستور وصول چک" = "فرم دستور وصول چک",
  "برگ چک سایر بانک ها" = "برگ چک سایر بانک ها",
}

@Component({
  selector: "app-scan-file-set",
  templateUrl: "./scan-file-set.component.html",
  styleUrls: ["./scan-file-set.component.scss"],
})
export class ScanFileSetComponent implements OnInit {
  @Input()
  fileContradictionSets: FileContradictionModel;
  registerDate: string;
  reason: string = "";
  docnumber: any[] = [];
  docdate: any[] = [];
  docbranchcode: any[] = [];
  documentSetType: string = "";
  documentClass: any;
  documentType: any = "";
  documentDescription: any;
  documentDescriptionShow: any;
  documentClassShow: any;
  documentTypeShow: any;
  toBranchShow: any;
  statusKeys = Object.keys(DocumentStateAllEnum).map((key) => ({
    label: DocumentStateAllEnum[key],
    value: key,
  }));
  documents: any[] = [];
  documentList: any[] = [];
  public formGroup: FormGroup;
  public formGroup2: FormGroup;
  public formGroup3: FormGroup;
  public formGroup4: FormGroup;
  selectedItem: any = {};
  selectedDoc: ConfirmStateModel;
  private ngbModalRef: NgbModalRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  maintenanceCode: string;
  link: string;
  open: boolean = false;
  type: string = "";
  roleCheck: string;
  transactions: any[] = [];
  documentTypes: any[] = [];
  similarityClass: number;
  similarityDescription: number;
  similarityBranchCode: number;
  @ViewChild("accordion", { static: false }) accordion: Accordion;
  @ViewChild(PersianDatePickerComponent, { static: false })
  persianComponentRef!: PersianDatePickerComponent;

  fileUrl: SafeUrl;

  typeFile: string;

  description: string = "";
  enumKeys = Object.keys(TransactionTypeEnum).map((key) => ({
    label: TransactionTypeEnum[key],
    value: key,
  }));
  enumKeysChakavak = Object.keys(TransactionTypeChakavakEnum).map((key) => ({
    label: TransactionTypeChakavakEnum[key],
    value: key,
  }));
  enumKeysBanks = Object.keys(BankListEnum).map((key) => ({
    label: BankListEnum[key],
    value: key,
  }));
  enumTypeOfDoc = Object.keys(TypeOfDocEnum0).map((key) => ({
    label: TypeOfDocEnum0[key],
    value: key,
  }));

  enumKeysOther = Object.keys(DocumentSetOtherTypeEnum).map((key) => ({
    label: DocumentSetOtherTypeEnum[key],
    value: key,
  }));

  metaCheck: any[] = [];
  nameCheck: any[] = [];

  meta: boolean;

  shortLink: string = "";
  loading: boolean = false;
  file: File = null;

  fileEdit: File = null;

  enumKeysConflicts: any;
  public formGroupConflict: FormGroup;

  selectedState: string = "";

  originalMaintenanceCode: string = "";
  isInputChanged: boolean = false;

  isCompleted: boolean = false;

  branchName: string = "";

  sayyadNo: string = "";
  chequeNo: string = "";
  chequeDate: string = "";
  toBranch: any = "";
  fromBranch: string = "";

  statusOtherKeys: any[] = [];
  defaultStatusKey: any = null;
  fileType: any = "";
  selectedType: any;

  numberInputValue: string[] = ["", "", "", ""];

  @ViewChild(OtpInputComponent, { static: false })
  otpInputComponent!: OtpInputComponent;

  statusKeysLabel: any = "";
  documentClassLabel: any = "";
  documentDescriptionLabel: any = "";

  constructor(
    private manageFileService: ManageFileService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private persianCalendarService: PersianCalendarService,
    private manageDocumentService: ManageDocumentService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.roleCheck = localStorage.getItem("roleName");
    this.isInputChanged = false;
    this.formGroup = this.formBuilder.group({
      maintenanceCode: new FormControl(""),
    });
    this.formGroup2 = this.formBuilder.group({
      docnumber: new FormControl(""),
      docbranchcode: new FormControl(""),
      docdate: new FormControl(""),
      documentSetType: new FormControl(""),
      documentClass: new FormControl(""),
      documentType: new FormControl(""),
      documentDescription: new FormControl(""),
    });
    this.formGroup3 = this.formBuilder.group({
      documentSetType: new FormControl(""),
      chequeNo: new FormControl(""),
      chequeDate: new FormControl(""),
      toBranch: new FormControl(""),
      fromBranch: new FormControl(""),
      documentType: new FormControl(""),
      documentClass: new FormControl(""),
    });
    this.formGroup4 = this.formBuilder.group({
      customerNumber: new FormControl(""),
      fileNumber: new FormControl(""),
      fileStatus: new FormControl(""),
      documentType: new FormControl(""),
    });

    this.branchName = this.fileContradictionSets.branch
      ? this.fileContradictionSets.branch.branchName +
        "-" +
        this.fileContradictionSets.branch.branchCode
      : "";

    this.getData();
    this.getAllTransaction();
    this.getAllDocumentTypes();
    this.getConflict();

    if (
      this.fileContradictionSets.type !== "DAILY" &&
      this.fileContradictionSets.type !== "CHAKAVAK"
    ) {
      this.isCompleted = true;
      this.fileType = this.fileContradictionSets.type;
      this.selectedType = {
        label: DocumentSetTypeEnum[this.fileContradictionSets.type],
        value: this.fileContradictionSets.type,
      };
      this.manageDocumentService
        .getFileTypeByEnum(this.fileContradictionSets.type)
        .then((k) => {
          this.statusOtherKeys = k.fileStatuses.map((k) => ({
            label: k.title,
            value: k.id,
            isDefault: k.isDefault,
          }));

          this.defaultStatusKey = this.statusOtherKeys.find(
            (status) => (status.value = this.fileContradictionSets.fileStatusId)
          );
        });
    }
  }

  getFileType(type: FileTypeEnum) {
    return FileTypeEnum[type];
  }

  setType(event: any) {
    this.statusOtherKeys = [];
    this.fileContradictionSets.type = event.value.value;
    this.fileType = this.fileContradictionSets.type;
    console.log(event.value);
    this.manageDocumentService
      .getFileTypeByEnum(this.fileContradictionSets.type)
      .then((k) => {
        this.statusOtherKeys = k.fileStatuses.map((k) => ({
          label: k.title,
          value: k.id,
          isDefault: k.isDefault,
        }));

        this.defaultStatusKey = this.statusOtherKeys.find(
          (status) => status.isDefault
        );
      });
  }

  setFileStatusId(event: any) {
    this.fileContradictionSets.fileStatusId = event.value.value;
  }

  setState(event: any) {
    this.statusKeysLabel = event.value.label;

    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.selectedState = DocumentEnumUtil.getValue(event.value);
      this.filterTable();
    } else {
      this.manageFileService
        .getFileSetById(this.fileContradictionSets.id)
        .then((res) => {
          this.documentList = [...res.documents];
        });
    }
  }

  getData() {
    this.manageFileService
      .getFileSetById(this.fileContradictionSets.id)
      .then((res) => {
        this.documents = res.documents;
        this.type = res.type;
        this.documentList = [...res.documents]; // Initialize documentList with complete data
      });
  }

  filterTable() {
    this.manageFileService
      .getByDocumentState(this.fileContradictionSets.id, this.selectedState)
      .then((res) => {
        this.documentList = res;
      });
  }

  onChange(event) {
    this.file = event.target.files[0];
  }

  onChangeEdit(event) {
    this.fileEdit = event.target.files[0];
  }

  onUpload() {
    if (this.file === null) {
      this.toastr.info("لطفا فایل را انتخاب کنید.");
    } else {
      this.loading = !this.loading;
      this.manageFileService
        .upload(this.fileContradictionSets.id, this.file)
        .subscribe(
          (event: any) => {
            if (typeof event === "object") {
              this.shortLink = event.link;
              this.loading = false;
              this.toastr.success("بارگذاری فایل با موفقیت انجام شد.");
              this.ngbModalRef.dismiss();
              this.documentList = [];
              this.manageFileService
                .getFileSetById(this.fileContradictionSets.id)
                .then((res) => {
                  this.documents = res.documents;
                  this.type = res.type;
                  this.getAllDoucmentById(res.documents);
                });
            }
          },
          (err) => {
            this.loading = false;
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
            this.ngbModalRef.dismiss();
          }
        );
    }
  }

  onUploadEdit() {
    if (this.fileEdit === null) {
      this.toastr.info("لطفا فایل را انتخاب کنید.");
    } else {
      this.loading = !this.loading;
      this.manageFileService
        .uploadEdit(
          this.selectedDoc.documentSetId,
          this.selectedDoc.file.uuid,
          this.fileEdit
        )
        .subscribe(
          (event: any) => {
            if (typeof event === "object") {
              this.loading = false;
              this.toastr.success("بارگذاری فایل با موفقیت انجام شد.");
              this.ngbModalRef.dismiss();
              this.documentList = [];
              this.manageFileService
                .getFileSetById(this.fileContradictionSets.id)
                .then((res) => {
                  this.documents = res.documents;
                  this.type = res.type;
                  this.selectedItem = {};
                  this.getAllDoucmentById(res.documents);
                });
            }
          },
          (err) => {
            this.loading = false;
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
            this.ngbModalRef.dismiss();
          }
        );
    }
  }

  getConflict() {
    this.manageDocumentService
      .getConflictOfDocument("DOCUMENT", this.fileContradictionSets.type)
      .then((res) => {
        this.enumKeysConflicts = res.map((k) => ({
          label: k.reason,
          value: k.id,
        }));
      });
  }

  getAllTransaction() {
    this.manageDocumentService.getAllTransaction(0, 100).then((res: any) => {
      this.transactions = res.content;
    });
  }

  getAllDocumentTypes() {
    this.manageDocumentService.getAllDocumentTypesList().then((res: any) => {
      if (res && Array.isArray(res)) {
        res.forEach((item) => {
          this.documentTypes.push(item);
        });
      } else {
        this.documentTypes = res;
      }
      this.onPageChange({ first: 0, rows: this.itemsPerPage });
    });
  }

  currentPageItems: any[] = [];
  itemsPerPage = 1500; // Number of items to display per page

  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItems = this.documentTypes.slice(startIndex, endIndex);
  }

  public onAdditionalDownload(id: string): void {
    this.link = null;
    this.open = false;
    this.manageFileService
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

  getType(type: any) {
    return DocumentSetTypeEnum[type];
  }

  getClass(type: any) {
    return TransactionTypeEnum[type];
  }

  submitCode() {
    let request = {
      documentId: this.selectedItem.id,
      maintenanceCode: this.maintenanceCode,
    };
    if (this.maintenanceCode) {
      this.manageFileService
        .updateDocument(request)
        .then(() => {
          this.toastr.success("کد نگهداری با موفقیت ثبت شد.");
          this.selectedItem.maintenanceCode = this.maintenanceCode;
        })
        .catch(() => {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
    } else {
      this.toastr.info("لطفا کد نگهداری را وارد کنید.", "خطا");
    }
  }

  submitMetaData() {
    let request = {
      uuid: this.selectedItem.fileUuid,
      metadata: [
        {
          name: "documentNo",
          value: JSON.stringify(this.docnumber),
        },
        {
          name: "date",
          value: JSON.stringify(this.docdate),
        },
        {
          name: "branchCode",
          value: JSON.stringify(this.docbranchcode),
        },
        {
          name: "documentClass",
          value: this.documentClass ? this.documentClass.value : "",
        },
        {
          name: "documentDescription",
          value: this.documentDescription ? this.documentDescription.title : "",
        },
        {
          name: "dailyCompleted",
          value: "true",
        },
      ],
    };

    this.metaCheck = request.metadata.map((val) => val.value);

    this.nameCheck = request.metadata.map((val) => val.name);
    const requiredFields = [
      "documentNo",
      "date",
      "branchCode",
      "documentClass",
      "documentDescription",
    ];

    const missingFields = requiredFields.filter(
      (field) => !this.nameCheck.includes(field)
    );

    const hasNull = this.metaCheck.some((item) => {
      return item == null || item == undefined || item == "" || item == "[]";
    });

    if (missingFields.length === 0 && !hasNull) {
      this.meta = false;
    } else {
      this.meta = true;
    }

    // if (this.meta) {
    //   this.toastr.info("لطفا تمام فیلدهای متادیتا را وارد کنید.");
    // } else {
    this.manageFileService
      .updateMetaData(request)
      .then(() => {
        this.toastr.success("متادیتا با موفقیت ثبت شد.");
        this.selectedItem.file.properties = request.metadata;
        this.isCompleted = true;
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
    // }
  }

  submitMetaDataChakavak() {
    let request = {
      uuid: this.selectedItem.fileUuid,
      metadata: [
        {
          name: "sayyadNo",
          value: this.otpInputComponent.getOtpValue(),
        },
        {
          name: "chequeNo",
          value: this.chequeNo,
        },
        {
          name: "chequeDate",
          value: this.chequeDate,
        },
        {
          name: "toBranch",
          value: this.toBranch ? this.toBranch.value : "",
        },
        {
          name: "chequeClass",
          value: this.documentClass ? this.documentClass.value : "",
        },
        {
          name: "documentType",
          value: this.documentType ? this.documentType.value : "",
        },
        {
          name: "fromBranch",
          value: this.fromBranch,
        },
        {
          name: "chakavakCompleted",
          value: "true",
        },
      ],
    };
    this.manageFileService
      .updateMetaData(request)
      .then(() => {
        this.toastr.success("متادیتا با موفقیت ثبت شد.");
        this.selectedItem.file.properties = request.metadata;
        this.isCompleted = true;
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  submitMetaDataOther() {
    let body = {
      id: this.fileContradictionSets.id,
      type: this.selectedType.value,
      customerNumber: this.fileContradictionSets.customerNumber,
      fileNumber: this.fileContradictionSets.fileNumber,
      fileStatusId: this.fileContradictionSets.fileStatusId,
      fromDate: this.fileContradictionSets.fromDate,
      toDate: this.fileContradictionSets.toDate,
    };
    this.manageDocumentService
      .updateDocumentSet(body)
      .then((res) => {
        this.fileContradictionSets = res;
        this.isCompleted = true;
        this.toastr.success("تغییرات با موفقیت ثبت شد.");
      })
      .catch((err) => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      return this.persianCalendarService.PersianCalendarNumericFormat(sendDate);
    }
  }

  private getAllDoucmentById(docs: any) {
    this.documentList = []; // Clear the current list

    if (docs && docs.length > 0) {
      docs.forEach((doc) => {
        this.documentList.push(doc);
        this.documentList = this.documentList.sort((a: any, b: any) => {
          return <any>a.id - <any>b.id;
        });
      });
    }
  }

  getState(state: DocumentStateEnum) {
    return DocumentStateEnum[state];
  }

  openModalClick(content, selectedDoc?: ConfirmStateModel) {
    this.selectedDoc = selectedDoc;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then(() => {
      this.passEntry.emit();
    });
  }

  submitNew(indexTab?: number) {
    this.manageFileService.getDocumentById(this.selectedItem.id).then((res) => {
      let filtered = this.documentList.filter(
        (item) => item.id === this.selectedItem.id
      );
      const index = this.documentList.indexOf(filtered[0], 0);
      if (index > -1) {
        this.documentList[index] = res;
        this.selectedItem.currentState = res.currentState;
        this.selectedItem.conflicts = res.conflicts;
        this.selectedItem = res;
      }
      this.accordion.updateActiveIndex();
      if (indexTab) {
        this.accordion.tabs[1].toggle(1);
      }
    });
  }

  onInputChange() {
    // Check if the input value has changed
    this.isInputChanged = this.maintenanceCode !== this.originalMaintenanceCode;
  }

  confirmDoc() {
    this.metaCheck = this.selectedItem.file.properties.map((val) => val.value);

    this.nameCheck = this.selectedItem.file.properties.map((val) => val.name);
    const requiredFields = [
      "documentNo",
      "date",
      "branchCode",
      "documentClass",
      "documentDescription",
    ];

    const missingFields = requiredFields.filter(
      (field) => !this.nameCheck.includes(field)
    );

    const hasNull = this.metaCheck.some((item) => {
      return item == null || item == undefined || item == "" || item == "[]";
    });

    if (missingFields.length === 0 && !hasNull) {
      this.meta = false;
    } else {
      this.meta = true;
    }

    if (
      this.selectedItem.maintenanceCode === undefined ||
      this.selectedItem.maintenanceCode === null
    ) {
      this.toastr.info("لطفا کد نگهداری را وارد کنید.", "خطا");
    }
    // else if (hasNull) {
    //   this.toastr.info("لطفا تمام فیلدهای متادیتا را وارد کنید.");
    // }
    else {
      swal
        .fire({
          title: "آیا از تائید اولیه فایل  اطمینان دارید؟",
          showCancelButton: true,
          confirmButtonColor: "#820263",
          cancelButtonColor: "#625e61",
          cancelButtonText: "انصراف",
          confirmButtonText: "!بله تایید کن",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            let request = [this.selectedItem.id];

            this.manageFileService.primaryConfirm(request).then(() => {
              this.manageFileService
                .getDocumentById(this.selectedItem.id)
                .then((res) => {
                  let filtered = this.documentList.filter(
                    (item) => item.id === this.selectedItem.id
                  );
                  const index = this.documentList.indexOf(filtered[0], 0);
                  if (index > -1) {
                    this.documentList[index] = res;
                    this.selectedItem = res;
                  }
                  this.selectedItem.currentState = "PRIMARY_CONFIRMED";
                  this.accordion.updateActiveIndex();
                  this.accordion.tabs[2].toggle(2);
                });
              this.toastr.success("تائید فایل با موفقیت انجام شد.");
            });
          }
        })
        .catch((err) => {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
    }
  }

  onSelectCheckbox() {
    this.isInputChanged = false;
    this.isCompleted = false;

    this.metaCheck = this.selectedItem.file.properties.map((val) => val.value);

    this.nameCheck = this.selectedItem.file.properties.map((val) => val.name);
    const requiredFields = [
      "documentNo",
      "date",
      "branchCode",
      "documentClass",
      "documentDescription",
    ];

    const missingFields = requiredFields.filter(
      (field) => !this.nameCheck.includes(field)
    );

    const hasNull = this.metaCheck.some((item) => {
      return item == null || item == undefined || item == "" || item == "[]";
    });

    if (missingFields.length === 0 && !hasNull) {
      this.meta = false;
    } else {
      this.meta = true;
    }

    if (this.fileContradictionSets.type === "CHAKAVAK") {
      this.ressetFormChakavak();
    } else {
      this.resetForm();
    }
    this.onAdditionalDownload(this.selectedItem.fileUuid);
    this.description = this.selectedItem.state.description;
    this.maintenanceCode = this.selectedItem.maintenanceCode;
    if (this.selectedItem.conflicts.length > 0) {
      this.reason = this.selectedItem.conflicts[0].conflictReasons[0].reason;
    } else {
      this.reason = null;
    }
    this.typeFile = this.selectedItem.file.mimeType;
    if (this.fileContradictionSets.type === "DAILY") {
      if (this.selectedItem.file.properties.length > 0) {
        this.selectedItem.file.properties.map((item: PropDocModel) => {
          if (item.name === "dailyCompleted") {
            if (item.value === "true") {
              this.isCompleted = true;
            } else {
              this.isCompleted = false;
            }
          }
          if (item.name === "documentNo") {
            if (
              item.value != "" &&
              item.value != null &&
              item.value.length > 0
            ) {
              this.docnumber = item.value
                .trim()
                .slice(1, -1)
                .split(",")
                .map((element) => String(element.trim().replaceAll(`"`, " ")))
                .filter((element) => element !== null && element !== "");
            }
          }
          if (item.name === "date") {
            if (
              item.value != "" &&
              item.value != null &&
              item.value.length > 0
            ) {
              this.docdate = item.value
                .trim()
                .slice(1, -1)
                .split(",")
                .map((element) => String(element.trim().replaceAll(`"`, " ")))
                .filter((element) => element !== null && element !== "");
            }
          }
          if (item.name === "branchCode") {
            this.similarityBranchCode =
              item.value && item.value.includes(this.selectedItem.branchCode)
                ? 0.6
                : 0.2;
            if (
              item.value != "" &&
              item.value != null &&
              item.value.length > 0
            ) {
              this.docbranchcode = item.value
                .trim()
                .slice(1, -1)
                .split(",")
                .map((element) => String(element.trim().replaceAll(`"`, " ")))
                .filter((element) => element !== null && element !== "");
            }
          }
          if (item.name === "documentSetType") {
            this.documentSetType = this.getType(this.type);
          }

          if (item.name === "documentClass") {
            this.documentClassShow = item.value;
            this.similarityClass =
              item.value && item.value !== "" && item.validation
                ? item.validation.similarity
                : null;

            let classFilterd = this.enumKeys.filter((filtered1) => {
              if (
                item.value != "" &&
                item.value != null &&
                item.value.length > 0
              ) {
                let str: string = filtered1.label.replace(/ /g, "");
                if (str.includes(item.value.replace(/ /g, ""))) {
                  return true;
                }
              }
            });
            if (classFilterd && classFilterd.length > 0) {
              this.documentClass = classFilterd[0];
            } else {
              this.documentClass = null;
            }
          }

          if (item.name === "documentDescription") {
            this.documentDescriptionShow = item.value;
            this.similarityDescription =
              item.value && item.value !== "" && item.validation
                ? item.validation.similarity
                : null;
            let descFilter = this.documentTypes.filter((filtered2) => {
              if (
                item.value != "" &&
                item.value != null &&
                item.value.length > 0
              ) {
                let str: string = filtered2.title.replace(/ /g, "");
                if (str.includes(item.value.replace(/ /g, ""))) {
                  return true;
                }
              }
            });
            if (descFilter && descFilter.length > 0) {
              this.documentDescription = descFilter[0];
            } else {
              this.documentDescription = null;
            }
          }
        });
      } else {
        this.resetForm();
      }
    }
    if (this.fileContradictionSets.type === "CHAKAVAK") {
      if (this.selectedItem.file.properties.length > 0) {
        this.selectedItem.file.properties.map((item: PropDocModel) => {
          if (item.name === "chakavakCompleted") {
            if (item.value === "true") {
              this.isCompleted = true;
            } else {
              this.isCompleted = false;
            }
          }
          if (item.name === "sayyadNo") {
            this.selectedItem.currentState !== "STAGNANT"
              ? this.otpInputComponent.setOtpValue(item.value)
              : (this.sayyadNo = item.value);
          }
          if (item.name === "chequeNo") {
            this.chequeNo = item.value;
          }
          if (item.name === "chequeDate") {
            this.chequeDate = item.value;
          }
          if (item.name === "toBranch") {
            this.toBranchShow = item.value;
            let classFilterd = this.enumKeysBanks.filter((filtered1) => {
              if (
                item.value != "" &&
                item.value != null &&
                item.value.length > 0
              ) {
                let str: string = filtered1.label.replace(/ /g, "");
                if (str.includes(item.value.replace(/ /g, ""))) {
                  return true;
                }
              }
            });
            if (classFilterd && classFilterd.length > 0) {
              this.toBranch = classFilterd[0];
            } else {
              this.toBranch = null;
            }
          }
          if (item.name === "chequeClass") {
            this.documentClassShow = item.value;
            this.similarityClass =
              item.value && item.value !== "" && item.validation
                ? item.validation.similarity
                : null;

            let classFilterd = this.enumKeysChakavak.filter((filtered1) => {
              if (
                item.value != "" &&
                item.value != null &&
                item.value.length > 0
              ) {
                let str: string = filtered1.label.replace(/ /g, "");
                if (str.includes(item.value.replace(/ /g, ""))) {
                  return true;
                }
              }
            });
            if (classFilterd && classFilterd.length > 0) {
              this.documentClass = classFilterd[0];
            } else {
              this.documentClass = null;
            }
          }
          if (item.name === "documentType") {
            this.documentTypeShow = item.value;
            this.similarityClass =
              item.value && item.value !== "" && item.validation
                ? item.validation.similarity
                : null;

            let classFilterd = this.enumTypeOfDoc.filter((filtered1) => {
              if (
                item.value != "" &&
                item.value != null &&
                item.value.length > 0
              ) {
                let str: string = filtered1.label.replace(/ /g, "");
                if (str.includes(item.value.replace(/ /g, ""))) {
                  return true;
                }
              }
            });
            if (classFilterd && classFilterd.length > 0) {
              this.documentType = classFilterd[0];
            } else {
              this.documentType = null;
            }
          }
          if (item.name === "fromBranch") {
            this.fromBranch = item.value;
          }
        });
      } else {
        this.ressetFormChakavak();
      }
    }
  }

  resetForm() {
    this.docnumber = [];
    this.docdate = [];
    this.docbranchcode = [];
    this.documentSetType = this.getType(this.type);
    this.documentClass = null;
    this.documentType = "";
    this.documentDescription = null;
    this.similarityClass = null;
    this.similarityDescription = null;
    this.similarityBranchCode = null;
  }

  ressetFormChakavak() {
    this.docnumber = [];
    this.docdate = [];
    this.docbranchcode = [];
    this.documentSetType = this.getType(this.type);
    this.documentClass = null;
    this.documentType = "";
    this.documentDescription = null;
    this.sayyadNo = "";
    this.chequeNo = "";
    this.chequeDate = "";
    this.toBranch = "";
    this.fromBranch = "";
    this.selectedItem.currentState !== "STAGNANT"
      ? this.otpInputComponent.setOtpValue("")
      : (this.sayyadNo = "");
  }

  findFromArray(array: any[], value) {
    let filtered = array.filter((item) => item.description === value);
    return filtered && filtered.length > 0 ? filtered[0] : null;
  }

  setDocumentClass(event: any) {
    if (event.value.value === "چک بین بانکی (رمزدار)") {
      this.enumTypeOfDoc = Object.keys(TypeOfDocEnum2).map((key) => ({
        label: TypeOfDocEnum2[key],
        value: key,
      }));
    } else if (event.value.value !== "چک بین بانکی (رمزدار)") {
      this.enumTypeOfDoc = Object.keys(TypeOfDocEnum1).map((key) => ({
        label: TypeOfDocEnum1[key],
        value: key,
      }));
    }

    this.documentClassLabel = event.value.label;
  }

  setDocumentDescription(event: any) {
    this.documentDescriptionLabel = event.value.title;
  }

  onBranchCodeChange(event: string) {
    if (event && event.includes(this.selectedItem.branchCode)) {
      this.similarityBranchCode = 0.6;
    } else {
      this.similarityBranchCode = 0.4;
    }
  }

  onSelect(event: Event) {}

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: any[] = [ENTER, COMMA];
  docbranchcodeCtrl = new FormControl();

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add the value to the array
    if ((value || "").trim()) {
      this.docbranchcode.push(String(value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    // Reset the control value
    this.docbranchcodeCtrl.setValue(null);
  }

  remove(branchCode: number): void {
    // Remove the branch code from the array
    const index = this.docbranchcode.indexOf(branchCode);
    if (index >= 0) {
      this.docbranchcode.splice(index, 1);
    }
  }

  visiblenum = true;
  selectablenum = true;
  removablenum = true;
  addOnBlurnum = true;
  separatorKeysCodesnum: any[] = [ENTER, COMMA];
  docnumCtrl = new FormControl();

  addnum(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add the value to the array
    if ((value || "").trim()) {
      this.docnumber.push(String(value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    // Reset the control value
    this.docnumCtrl.setValue(null);
  }

  removenum(docNumber: number): void {
    // Remove the branch code from the array
    const index = this.docnumber.indexOf(docNumber);
    if (index >= 0) {
      this.docnumber.splice(index, 1);
    }
  }
  removabledate = true;
  addOnBlurdate = true;
  separatorKeysCodesdate: number[] = [ENTER, COMMA];
  docCtrldate = new FormControl();

  addDateFromPicker(selectedDate: any): void {
    if (selectedDate) {
      const date =
        this.persianCalendarService.PersianCalendarNumericFormat(selectedDate); // Convert the selected date to a string or format it as needed

      this.docdate.push(date);

      this.persianComponentRef.emitValue();
    } else {
      //
    }
  }

  addDateManually(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add the value to the array
    if ((value || "").trim()) {
      this.docdate.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    // Reset the control value
    this.docCtrldate.setValue(null);
  }

  removedate(docDate: any): void {
    // Remove the date from the array
    const index = this.docdate.indexOf(docDate);
    if (index >= 0) {
      this.docdate.splice(index, 1);
    }
  }
}
