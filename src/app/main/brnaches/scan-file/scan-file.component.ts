import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { ConfirmStateModel } from "../../documents/manage-checking/confirm-state.model";
import { ManageFileService } from "../../service/manage-file.service";
import { FileContradictionModel } from "../manage-contradiction-in-branch/file-contradiction.model";
import { DocumentSetTypeEnum, FileTypeEnum } from "../manage-document/document-set-type.enum";

@Component({
  selector: "app-scan-file",
  templateUrl: "./scan-file.component.html",
  styleUrls: ["./scan-file.component.scss"],
})
export class ScanFileComponent implements OnInit {
  @Input()
  fileContradictionSets: FileContradictionModel;
  registerDate: string;
  reason: string = "";
  docnumber: string = "";
  doctype: string = "";
  docdate: string = "";
  docdesc: string = "";
  branchcode: string = "";
  documentSetType: string = "";
  documentClass: string = "";
  documentType: string = "";
  documentDescription: string = "";
  docclass: string = "";
  open: boolean = false;
  link: string;

  fileUrl: SafeUrl;

  typeFile: string;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  private ngbModalRef: NgbModalRef;

  selectedDoc: ConfirmStateModel;

  fileType: any = "";

  sayyadNo: string = "";
  chequeNo: string = "";
  chequeDate: string = "";
  toBranch: any = "";
  fromBranch: string = "";
  documentTypeShow: any = "";
  documentClassShow: any = "";
  toBranchShow: any = "";
  branchName: string = "";

  constructor(
    private manageFileService: ManageFileService,
    private persianCalendarService: PersianCalendarService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.branchName = this.fileContradictionSets.branch
      ? this.fileContradictionSets.branch.branchName +
        "-" +
        this.fileContradictionSets.branch.branchCode
      : "";
    if (
      this.fileContradictionSets.type !== "DAILY" &&
      this.fileContradictionSets.type !== "CHAKAVAK"
    ) {
      this.fileType = this.fileContradictionSets.type;
    }
    this.manageFileService
      .getDocumentById(this.fileContradictionSets.id)
      .then((res) => {
        this.fileContradictionSets = res;
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
                this.docnumber = item.value.replace("[", "").replace("]", "");
              }
              if (item.name === "date") {
                this.docdate = item.value.replace("[", "").replace("]", "");
              }
              if (item.name === "branchCode") {
                this.branchcode = item.value.replace("[", "").replace("]", "");
              }

              if (item.name === "documentSetType") {
                this.documentSetType = item.value;
              }
              if (item.name === "documentClass") {
                this.documentClass = item.value;
              }
              if (item.name === "documentType") {
                this.documentType = item.value;
              }
              if (item.name === "documentDescription") {
                this.documentDescription = item.value;
              }
            });
          } else {
            this.docnumber = "-";
            this.docdate = "-";
            this.branchcode = "-";
            this.documentSetType = "-";
            this.documentClass = "-";
            this.documentType = "-";
            this.documentDescription = "-";
          }
        }
        if (this.fileContradictionSets.type === "CHAKAVAK") {
          if (this.fileContradictionSets.file.properties.length > 0) {
            this.fileContradictionSets.file.properties.map((item) => {
              if (item.name === "sayyadNo") {
                this.sayyadNo = item.value;
              }
              if (item.name === "chequeNo") {
                this.chequeNo = item.value;
              }
              if (item.name === "chequeDate") {
                this.chequeDate = item.value;
              }
              if (item.name === "toBranch") {
                this.toBranchShow = item.value;
              }
              if (item.name === "chequeClass") {
                this.documentClassShow = item.value;
              }
              if (item.name === "documentType") {
                this.documentTypeShow = item.value;
              }
              if (item.name === "fromBranch") {
                this.fromBranch = item.value;
              }
            });
          } else {
            this.sayyadNo = "";
            this.chequeNo = "";
            this.chequeDate = "";
            this.toBranch = "";
            this.fromBranch = "";
            this.documentTypeShow = "";
            this.documentClassShow = "";
            this.toBranchShow = "";
          }
        }
      });
    this.documentSetType = this.getType(this.fileContradictionSets.type);
  }

  getFileType(type: FileTypeEnum) {
    return FileTypeEnum[type];
  }

  getType(type: any) {
    return DocumentSetTypeEnum[type];
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
}
