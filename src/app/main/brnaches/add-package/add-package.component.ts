import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ManageDocumentService } from "../../service/manage-document.service";
import {
  DocumentSetTypeEnum,
  FileTypeEnum,
} from "../manage-document/document-set-type.enum";
import { DocumentSetModel } from "../manage-document/document-set.model";

@Component({
  selector: "app-add-package",
  templateUrl: "./add-package.component.html",
  styleUrls: ["./add-package.component.scss"],
})
export class AddPackageComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  selectedType: any;
  enumKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));
  public formGroup: FormGroup;
  public documentSetModel: DocumentSetModel = {};
  branchName: string = "";
  sequence: string = "";
  show: boolean = false;
  fileType: any = "";
  statusKeys: any[] = [];
  defaultStatusKey: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private manageDocumentService: ManageDocumentService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      type: new FormControl("", [Validators.required]),
      branchId: new FormControl(""),
      customerNumber: new FormControl(""),
      fileNumber: new FormControl(""),
      fileStatus: new FormControl(""),
    });
    this.manageDocumentService.getSequence().then((res) => {
      this.sequence = res;
    });
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-" + localStorage.getItem("branchName"));
  }

  setStartDate(event: any) {
    this.documentSetModel.fromDate = event;
  }

  setEndDate(event: any) {
    this.documentSetModel.toDate = event;
  }

  submit() {
    if (
      (this.documentSetModel.type === "DAILY" ||
        this.documentSetModel.type === "CHAKAVAK") &&
      (this.documentSetModel.fromDate === undefined ||
        this.documentSetModel.toDate === undefined)
    ) {
      this.toastr.info("لطفا فیلد تاریخ را وارد کنید", "خطا");
    } else {
      if (
        this.documentSetModel.type !== "DAILY" &&
        this.documentSetModel.type !== "CHAKAVAK" &&
        this.documentSetModel.fileStatusId === undefined
      ) {
        this.documentSetModel.fileStatusId = this.defaultStatusKey.value;
      }
      this.manageDocumentService
        .createDocumentSet(this.documentSetModel)
        .then(() => {
          this.passEntry.emit(true);
          this.toastr.success("ایجاد سند با موفقیت انجام شد.");
        })
        .catch((err) => {
          if (err.status === 400) {
            this.toastr.info("تاریخ از باید قبل از تاریخ تا باشد!", "خطا");
          } else {
            this.passEntry.emit(false);
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
          }
        });
    }
  }

  cancel() {
    this.passEntry.emit(false);
  }

  setType(event: any) {
    this.documentSetModel.type = event.value.value;

    this.fileType = this.documentSetModel.type;
    if (this.documentSetModel.type === "DAILY") {
      this.show = false;
    } else if (this.documentSetModel.type === "CHAKAVAK") {
      this.show = false;
    } else {
      this.show = true;
      this.statusKeys = [];
      this.defaultStatusKey = null;
      this.checkValidations(event);

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

  setFileStatusId(event: any) {
    this.documentSetModel.fileStatusId = event.value.value;
  }

  getType(type: DocumentSetTypeEnum) {
    return DocumentSetTypeEnum[type];
  }

  getFileType(type: FileTypeEnum) {
    return FileTypeEnum[type];
  }
}
