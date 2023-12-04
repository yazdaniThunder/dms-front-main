import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material";
import { SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { FileContradictionModel } from "../../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { DocumentSetTypeEnum } from "../../brnaches/manage-document/document-set-type.enum";
import { ManageFileService } from "../../service/manage-file.service";
import { ConfirmStateModel } from "../manage-checking/confirm-state.model";

export enum TransactionTypeEnum {
  "نقدی" = "نقدی",
  "انتقالی" = "انتقالی",
  "انتقال وجه از طریق سحاب" = "انتقال وجه از طریق سحاب",
  "صورت جلسه آمار ارزی" = "صورت جلسه آمار ارزی",
  "صورت جلسه رسیدگی اسناد پایان روز" = "صورت جلسه رسیدگی اسناد پایان روز",
  "روزنامه پایان روز کاربر" = "روزنامه پایان روز کاربر",
  "روزنامه کلی شعبه" = "روزنامه کلی شعبه",
}

@Component({
  selector: "app-show-conf-modal",
  templateUrl: "./show-conf-modal.component.html",
  styleUrls: ["./show-conf-modal.component.scss"],
})
export class ShowConfModalComponent implements OnInit {
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
  documentType: string = "";
  documentDescription: any;
  type: string = "";
  documentTypes: any[] = [];
  maintenanceCode: string;

  public formGroup2: FormGroup;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  private ngbModalRef: NgbModalRef;

  selectedDoc: ConfirmStateModel;

  public formGroup: FormGroup;

  fileUrl: SafeUrl;

  typeFile: string;

  enumKeys = Object.keys(TransactionTypeEnum).map((key) => ({
    label: TransactionTypeEnum[key],
    value: key,
  }));

  documentDescriptionLabel: any = "";
  documentClassLabel: any = "";

  constructor(
    private manageFileService: ManageFileService,
    private persianCalendarService: PersianCalendarService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      maintenanceCode: new FormControl(""),
    });

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

    this.getMetadata();
  }

  setDocumentClass(event) {
    this.documentClassLabel = event.value.label;
  }
  getMetadata() {
    this.manageFileService
      .getDocumentById(this.fileContradictionSets.id)
      .then((res) => {
        this.fileContradictionSets = res;
        this.type = res.type;
        this.documentSetType = this.getType(this.type);

        this.maintenanceCode = this.fileContradictionSets.maintenanceCode;

        this.onAdditionalDownload(this.fileContradictionSets.fileUuid);
        if (this.fileContradictionSets.conflicts.length > 0) {
          this.registerDate = res.conflicts[0].registerDate;
          this.reason = res.conflicts[0].conflictReasons[0].reason;
        } else {
          this.reason = null;
        }
        if (this.fileContradictionSets.file.properties.length > 0) {
          this.fileContradictionSets.file.properties.map((item) => {
            if (item.name === "documentNo") {
              this.docnumber = item.value
                .trim()
                .slice(1, -1)
                .split(",")
                .map((element: any) => element.trim().replaceAll(`"`, " "))
                .filter((element) => element !== null && element !== "");
            }
            if (item.name === "date") {
              this.docdate = item.value
                .trim()
                .slice(1, -1)
                .split(",")
                .map((element: any) => element.trim().replaceAll(`"`, " "))
                .filter((element) => element !== null && element !== "");
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
              this.docbranchcode = item.value
                .trim()
                .slice(1, -1)
                .split(",")
                .map((element: any) => element.trim().replaceAll(`"`, " "))
                .filter((element) => element !== null && element !== "");
            }
          });
        } else {
          this.resetForm();
        }
      });
  }

  setDocumentDescription(event: any) {
    this.documentDescriptionLabel = event.value.title;
  }

  resetForm() {
    this.docnumber = [];
    this.docdate = [];
    this.docbranchcode = [];
    this.documentSetType = this.getType(this.type);
    this.documentClass = null;
    this.documentType = "";
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

  openModalFilesClick(content, selectedDoc?: any) {
    this.selectedDoc = selectedDoc;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }

  submitCode() {
    let request = {
      documentId: this.fileContradictionSets.id,
      maintenanceCode: this.maintenanceCode,
    };
    if (this.maintenanceCode) {
      this.manageFileService
        .updateDocument(request)
        .then(() => {
          this.toastr.success("کد نگهداری با موفقیت ثبت شد.");
          this.fileContradictionSets.maintenanceCode = this.maintenanceCode;
        })
        .catch(() => {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
    } else {
      this.toastr.info("لطفا کد نگهداری را وارد کنید.", "خطا");
    }
  }
  confirmDoc() {
    if (
      this.fileContradictionSets.maintenanceCode === undefined ||
      this.fileContradictionSets.maintenanceCode === null
    ) {
      this.toastr.info("لطفا کد نگهداری را وارد کنید.", "خطا");
    } else {
      swal
        .fire({
          title: "آیا از تائید اولیه فایل اطمینان دارید؟",
          showCancelButton: true,
          confirmButtonColor: "#820263",
          cancelButtonColor: "#625e61",
          cancelButtonText: "انصراف",
          confirmButtonText: "!بله تایید کن",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            let body = [this.fileContradictionSets.id];

            this.manageFileService.primaryConfirm(body).then(() => {
              this.ngOnInit();
              this.passEntry.emit();
              this.toastr.success("تائید اسناد با موفقیت انجام شد.");
              this.submitNew();
            });
          }
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    }
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
}
