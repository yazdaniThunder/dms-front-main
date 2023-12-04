import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material";
import { SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { OtpInputComponent } from "src/app/shared/otp-input/otp-input.component";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { FileContradictionModel } from "../../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { DocumentSetTypeEnum, FileTypeEnum } from "../../brnaches/manage-document/document-set-type.enum";
import { ManageFileService } from "../../service/manage-file.service";
import { ConfirmStateModel } from "../manage-checking/confirm-state.model";
import { BankListEnum } from "../scan-file-set/banksList";
import {
  TypeOfDocEnum0,
  TypeOfDocEnum1,
  TypeOfDocEnum2,
} from "../scan-file-set/scan-file-set.component";

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

@Component({
  selector: "app-scan-file-confirm",
  templateUrl: "./scan-file-confirm.component.html",
  styleUrls: ["./scan-file-confirm.component.scss"],
})
export class ScanFileConfirmComponent implements OnInit {
  @Input()
  fileContradictionSets: FileContradictionModel;
  registerDate: string;
  reason: string = "";
  docnumber: any[] = [];
  doctype: string = "";
  docdate: any[] = [];
  docdesc: string;
  docclass: string;
  open: boolean = false;
  link: string;
  docbranchcode: any[] = [];
  documentSetType: string = "";
  documentClass: any;
  documentType: any = "";
  documentDescription: any;
  type: string = "";
  documentTypes: any[] = [];

  public formGroup2: FormGroup;
  public formGroup3: FormGroup;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  private ngbModalRef: NgbModalRef;

  selectedDoc: ConfirmStateModel;

  fileUrl: SafeUrl;

  typeFile: string;

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

  showInput = false;
  showUnitInput = false;

  branchName: string = "";

  sayyadNo: string = "";
  chequeNo: string = "";
  chequeDate: string = "";
  toBranch: any = "";
  fromBranch: string = "";

  documentClassLabel: any = "";
  documentDescriptionLabel: any = "";

  fileType: any = "";

  @ViewChild("typeElement", { static: false }) typeElement;
  @ViewChild("docNumElement", { static: false }) docNumElement;
  @ViewChild("branchCodeElement", { static: false }) branchCodeElement;

  @ViewChild(OtpInputComponent, { static: false })
  otpInputComponent!: OtpInputComponent;

  constructor(
    private manageFileService: ManageFileService,
    private renderer: Renderer2,
    private persianCalendarService: PersianCalendarService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.branchName =
      this.fileContradictionSets.branchName +
      "-" +
      this.fileContradictionSets.branchCode;

    this.getAllDocumentTypes();

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
      sayyadNo: new FormControl(""),
      chequeNo: new FormControl(""),
      chequeDate: new FormControl(""),
      toBranch: new FormControl(""),
      fromBranch: new FormControl(""),
      documentType: new FormControl(""),
      documentClass: new FormControl(""),
      documentSetType: new FormControl(""),
    });
    if (
      this.fileContradictionSets.type !== "DAILY" &&
      this.fileContradictionSets.type !== "CHAKAVAK"
    ) {
      this.fileType = this.fileContradictionSets.type;
    }
    setTimeout(() => {
      this.getMetadata();
    }, 1000);
  }
  getFileType(type: FileTypeEnum) {
    return FileTypeEnum[type];
  }
  setDocumentClass(event) {
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
    console.log(event);
  }

  getMetadata() {
    this.manageFileService
      .getDocumentById(this.fileContradictionSets.id)
      .then((res) => {
        this.fileContradictionSets = res;
        this.type = res.type;
        this.documentSetType = this.getType(this.type);

        this.onAdditionalDownload(this.fileContradictionSets.fileUuid);
        if (this.fileContradictionSets.conflicts.length > 0) {
          this.registerDate = res.conflicts[0].registerDate;
          this.reason = res.conflicts[0].conflictReasons[0].reason;
        } else {
          this.reason = null;
        }
        if (this.fileContradictionSets.type === "DAILY") {
          if (this.fileContradictionSets.file.properties.length > 0) {
            this.fileContradictionSets.file.properties.map((item) => {
              if (item.name === "documentNo") {
                this.docnumber = this.fixMetadataInputs(item.value);
              }
              if (item.name === "date") {
                this.docdate = this.fixMetadataInputs(item.value);
              }
              if (item.name === "documentSetType") {
                this.documentSetType = this.getType(this.type);
              }
              if (item.name === "documentClass") {
                let classFilterd = this.enumKeys.filter((filtered1) => {
                  if (item.value != "") {
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
                this.documentType = item.value;
              }

              if (item.name === "documentDescription") {
                let descFilter = this.documentTypes.filter((filtered2) => {
                  if (item.value != "") {
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
              if (item.name === "branchCode") {
                this.docbranchcode = this.fixMetadataInputs(item.value);
              }
            });
          } else {
            this.resetForm();
          }
        }
        if (this.fileContradictionSets.type === "CHAKAVAK") {
          if (this.fileContradictionSets.file.properties.length > 0) {
            this.fileContradictionSets.file.properties.map((item) => {
              if (item.name === "sayyadNo") {
                this.otpInputComponent.setOtpValue(item.value);
                this.sayyadNo = item.value;
              }
              if (item.name === "chequeNo") {
                this.chequeNo = item.value;
              }
              if (item.name === "chequeDate") {
                this.chequeDate = item.value;
              }
              if (item.name === "toBranch") {
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
            this.resetForm();
          }
        }
      });
  }

  fixMetadataInputs(value: any) {
    return value
      .trim()
      .slice(1, -1)
      .split(",")
      .map((element: any) => element.trim().replaceAll(`"`, " "))
      .map((element: any) => element.trim().replaceAll(`[`, " "))
      .map((element: any) => element.trim().replaceAll(`]`, " "))
      .filter((element) => element !== null && element !== "");
  }

  setDocumentDescription(event: any) {
    this.documentDescriptionLabel = event.value.label;
  }

  resetForm() {
    this.docnumber = [];
    this.docdate = [];
    this.docbranchcode = [];
    this.documentSetType = this.getType(this.type);
    this.documentClass = null;
    this.documentType = "";
    this.chequeNo = "";
    this.otpInputComponent.setOtpValue("");
    this.sayyadNo = "";
    this.documentDescription = null;
  }

  getType(type: any) {
    return DocumentSetTypeEnum[type];
  }

  getClass(type: any) {
    return TransactionTypeEnum[type];
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

  submitMetaData() {
    let request = {
      uuid: this.fileContradictionSets.fileUuid,
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
          name: "documentSetType",
          value: this.documentSetType,
        },
        {
          name: "documentClass",
          value: this.documentClass ? this.documentClass.value : "",
        },
        // {
        //   name: "documentType",
        //   value: this.documentType,
        // },
        {
          name: "documentDescription",
          value: this.documentDescription ? this.documentDescription.title : "",
        },
      ],
    };
    this.manageFileService
      .updateMetaData(request)
      .then(() => {
        this.toastr.success("متادیتا  با موفقیت ثبت شد.");
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  submitMetaDataChakavak() {
    let request = {
      uuid: this.fileContradictionSets.fileUuid,
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
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
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
          let request = [this.fileContradictionSets.id];
          let body = {
            ids: this.fileContradictionSets.id,
            operation: "reject",
          };
          this.manageFileService.acceptDocument(body).then(() => {
            this.manageFileService.primaryConfirm(request).then(() => {
              this.ngOnInit();
              this.passEntry.emit();
              this.toastr.success("تائید اسناد با موفقیت انجام شد.");
            });
          });
        }
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  openModalClick(content, selectedDoc?: any) {
    this.selectedDoc = selectedDoc;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }

  submitNew() {
    this.ngbModalRef.close();
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      var someDate = new Date(sendDate);
      return this.persianCalendarService.PersianCalendarNumeric(someDate);
    }
  }

  currentPageItems: any[] = [];
  itemsPerPage = 1500; // Number of items to display per page

  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItems = this.documentTypes.slice(startIndex, endIndex);
  }

  getAllDocumentTypes() {
    this.manageFileService.getAllDocumentTypesList().then((res: any) => {
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
      this.docbranchcode.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
    this.showUnitInput = false;

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
      this.docnumber.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }

    this.showInput = false;
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
  docbranchcodeCtrldate = new FormControl();

  addDateFromPicker(selectedDate: any): void {
    const date =
      this.persianCalendarService.PersianCalendarNumericFormat(selectedDate); // Convert the selected date to a string or format it as needed

    // Add the date to the array
    this.docdate.push(date);
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
    this.docbranchcodeCtrldate.setValue(null);
  }

  removedate(docDate: any): void {
    // Remove the date from the array
    const index = this.docdate.indexOf(docDate);
    if (index >= 0) {
      this.docdate.splice(index, 1);
    }
  }

  toggleInput(): void {
    this.showInput = !this.showInput;
    const inputElement = this.docNumElement.nativeElement as HTMLInputElement;
    this.renderer.setStyle(inputElement, "display", "block");
    inputElement.focus();
    if (this.showInput) {
      // Reset the input when showing it
      this.docnumCtrl.setValue("");
    }
  }

  toggleInputUnit(): void {
    this.showUnitInput = !this.showUnitInput;
    const inputElement = this.branchCodeElement
      .nativeElement as HTMLInputElement;
    this.renderer.setStyle(inputElement, "display", "block");
    inputElement.focus();
    if (this.showUnitInput) {
      // Reset the input when showing it
      this.docnumCtrl.setValue("");
    }
  }

  toggleInputDate(): void {
    this.showInput = !this.showInput;
    if (this.showInput) {
      // Reset the input when showing it
      this.docnumCtrl.setValue("");
    }
  }
}
