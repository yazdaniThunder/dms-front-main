import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ManageDocumentService } from "../../service/manage-document.service";
import {
  DocumentSetMainTypeEnum,
  DocumentSetOtherTypeEnum,
  DocumentSetTypeEnum,
  FileTypeEnum,
} from "../manage-document/document-set-type.enum";
import { DocumentSetModel } from "../manage-document/document-set.model";

@Component({
  selector: "edit-package",
  templateUrl: "./edit-package.component.html",
  styleUrls: ["./edit-package.component.scss"],
})
export class EditPackageComponent implements OnInit {
  @Input()
  documentSetModel: DocumentSetModel;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  selectedType: any;
  enumKeys = Object.keys(DocumentSetMainTypeEnum).map((key) => ({
    label: DocumentSetMainTypeEnum[key],
    value: key,
  }));

  enumKeysOther = Object.keys(DocumentSetOtherTypeEnum).map((key) => ({
    label: DocumentSetOtherTypeEnum[key],
    value: key,
  }));

  public formGroup: FormGroup;
  startDate: any;
  endDate: any;
  description: string;
  branch: string = "";
  rowsNumber: string = "";
  sequence: string = "";
  row: any;

  show: boolean = false;

  statusKeys: any[] = [];
  defaultStatusKey: any = null;
  fileType: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private manageDocumentService: ManageDocumentService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.description = this.documentSetModel.description;
    if (
      this.documentSetModel.type === "DAILY" ||
      this.documentSetModel.type === "CHAKAVAK"
    ) {
      this.show = false;
    } else {
      this.show = true;
    }

    if (this.show) {
      this.fileType = this.documentSetModel.type;

      this.manageDocumentService
        .getFileTypeByEnum(this.documentSetModel.type)
        .then((k) => {
          this.statusKeys = k.fileStatuses.map((k) => ({
            label: k.title,
            value: k.id,
            isDefault: k.isDefault,
          }));

          this.defaultStatusKey = this.statusKeys.find(
            (status) => (status.value = this.documentSetModel.fileStatusId)
          );
        });
    }
    this.branch = localStorage
      .getItem("branchCode")
      .concat("-", localStorage.getItem("branchName"));
    if (this.documentSetModel) {
      this.selectedType = {
        label: DocumentSetTypeEnum[this.documentSetModel.type],
        value: this.documentSetModel.type,
      };
      this.startDate = this.documentSetModel.fromDate.split("T", 1);
      this.endDate = this.documentSetModel.toDate.split("T", 1);
      this.rowsNumber = this.documentSetModel.rowsNumber;
      this.row = this.documentSetModel.sequence;
    }
    this.formGroup = this.formBuilder.group({
      createDateFrom: new FormControl(""),
      createDateTo: new FormControl(""),
      description: new FormControl(""),
      unit: new FormControl(""),
      type: new FormControl("", [Validators.required]),
      rowsNumber: new FormControl(""),
      row: new FormControl(""),
      customerNumber: new FormControl(""),
      fileNumber: new FormControl(""),
      fileStatus: new FormControl(""),
    });
  }

  setStartDate(event: any) {
    this.documentSetModel.fromDate = event;
  }

  setEndDate(event: any) {
    this.documentSetModel.toDate = event;
  }

  getType(type: DocumentSetTypeEnum) {
    return DocumentSetTypeEnum[type];
  }

  getFileType(type: FileTypeEnum) {
    return FileTypeEnum[type];
  }

  submit() {
    let request: DocumentSetModel = {
      id: this.documentSetModel.id,
      type: this.selectedType.value,
      fromDate: this.documentSetModel.fromDate,
      toDate: this.documentSetModel.toDate,
      description: this.description,
      sequence: this.row,
    };
    let body: DocumentSetModel = {
      id: this.documentSetModel.id,
      type: this.selectedType.value,
      description: this.description,
      sequence: this.row,
      customerNumber: this.documentSetModel.customerNumber,
      fileNumber: this.documentSetModel.fileNumber,
      fileStatusId: this.documentSetModel.fileStatusId,
    };
    if (
      this.show &&
      (this.documentSetModel.fromDate === undefined ||
        this.documentSetModel.toDate === undefined)
    ) {
      this.toastr.info("لطفا فیلد تاریخ را وارد کنید", "خطا");
    } else {
      if (this.show) {
        this.manageDocumentService
          .updateDocumentSet(body)
          .then((res) => {
            this.passEntry.emit(true);
            this.toastr.success("تغییرات با موفقیت ثبت شد.");
          })
          .catch((err) => {
            if (err.status === 400) {
              this.toastr.info("تاریخ از باید قبل از تاریخ تا باشد!", "خطا");
            } else {
              this.passEntry.emit(false);
              this.toastr.error("شماره ردیف دسته سند تکراری است!", "خطا");
            }
          });
      } else {
        this.manageDocumentService
          .updateDocumentSet(request)
          .then((res) => {
            this.passEntry.emit(true);
            this.toastr.success("تغییرات با موفقیت ثبت شد.");
          })
          .catch((err) => {
            if (err.status === 400) {
              this.toastr.info("تاریخ از باید قبل از تاریخ تا باشد!", "خطا");
            } else {
              this.passEntry.emit(false);
              this.toastr.error("شماره ردیف دسته سند تکراری است!", "خطا");
            }
          });
      }
    }
  }

  cancel() {
    this.passEntry.emit(false);
  }

  setType(event: any) {
    this.statusKeys = [];
    this.documentSetModel.type = event.value.value;
    this.fileType = this.documentSetModel.type;
    this.checkValidations(event);

    if (this.show) {
      this.manageDocumentService
        .getFileTypeByEnum(this.documentSetModel.type)
        .then((k) => {
          this.statusKeys = k.fileStatuses.map((k) => ({
            label: k.title,
            value: k.id,
            isDefault: k.isDefault,
          }));

          this.defaultStatusKey = this.statusKeys.find(
            (status) => status.isDefault
          );
        });
    }
  }

  setFileStatusId(event: any) {
    this.documentSetModel.fileStatusId = event.value.value;
  }

  private checkValidations(event: any) {
    let idx = event.value.value;
    this.clearAllValidators();
    if (idx !== "DAILY" && idx !== "CHAKAVAK") {
      this.formGroup.controls["customerNumber"].setValidators([
        Validators.required,
      ]);
      this.formGroup.controls["fileNumber"].setValidators([
        Validators.required,
      ]);

      this.formGroup.controls["customerNumber"].updateValueAndValidity();
      this.formGroup.controls["fileNumber"].updateValueAndValidity();
    }
  }

  clearAllValidators() {
    this.formGroup.controls["customerNumber"].clearValidators();
    this.formGroup.controls["fileNumber"].clearValidators();

    this.formGroup.controls["customerNumber"].updateValueAndValidity();
    this.formGroup.controls["fileNumber"].updateValueAndValidity();
  }
}
