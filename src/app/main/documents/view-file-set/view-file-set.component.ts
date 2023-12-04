import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { FileContradictionModel } from "../../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { DocumentStateEnum } from "../../brnaches/manage-document/document-set-state.enum";
import {
  DocumentSetTypeEnum,
  FileTypeEnum,
} from "../../brnaches/manage-document/document-set-type.enum";
import { ManageFileService } from "../../service/manage-file.service";
import { ConfirmStateModel } from "../manage-checking/confirm-state.model";

@Component({
  selector: "app-view-file-set",
  templateUrl: "./view-file-set.component.html",
  styleUrls: ["./view-file-set.component.scss"],
})
export class ViewFileSetComponent implements OnInit {
  @Input()
  fileContradictionSets: FileContradictionModel;
  registerDate: string;
  reason: string = "";
  docnumber: string = "";
  docdate: string = "";
  docbranchcode: string = "";
  documentSetType: string = "";
  documentClass: string = "";
  documentType: string = "";
  documentDescription: string = "";
  documents: any[] = [];
  documentList: any[] = [];
  documentListSelected: any[] = [];
  public formGroup: FormGroup;
  selectedItem: any = {};
  selectedDoc: ConfirmStateModel;
  private ngbModalRef: NgbModalRef;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  maintenanceCode: string;
  docId: string;
  type: string = "";

  fileUrl: SafeUrl;

  typeFile: string;

  link: string;
  open: boolean = false;

  sayyadNo: string = "";
  chequeNo: string = "";
  chequeDate: string = "";
  toBranch: any = "";
  fromBranch: string = "";
  documentTypeShow: any = "";
  documentClassShow: any = "";
  toBranchShow: any = "";
  branchName: string = "";


  fileType: any = "";

  constructor(
    private manageFileService: ManageFileService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private persianCalendarService: PersianCalendarService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.branchName = this.fileContradictionSets.branch
      ? this.fileContradictionSets.branch.branchName +
        "-" +
        this.fileContradictionSets.branch.branchCode
      : "";
    this.formGroup = this.formBuilder.group({
      maintenanceCode: new FormControl(""),
    });
    this.manageFileService
      .getFileSetById(this.fileContradictionSets.id)
      .then((res) => {
        this.documents = res.documents;
        this.type = res.type;
        this.getAllDoucmentById(res.documents);
      });

    if (
      this.fileContradictionSets.type !== "DAILY" &&
      this.fileContradictionSets.type !== "CHAKAVAK"
    ) {
      this.fileType = this.fileContradictionSets.type;
    }
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

  getFileType(type: FileTypeEnum) {
    return FileTypeEnum[type];
  }

  submitCode() {
    this.docId = this.documentListSelected
      .map((item) => item.documentSetId)
      .toString();
    let request = {
      documentSetId: +this.docId,
      maintenanceCode: this.maintenanceCode,
      fileUuid: this.documentListSelected
        .map((item) => item.fileUuid)
        .toString(),
    };
    this.manageFileService
      .updateDocument(this.documentListSelected[0])
      .then((res) => {
        this.passEntry.emit(true);
        this.toastr.success("کد نگهداری با موفقیت ثبت شد.");
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      var someDate = new Date(sendDate);
      return this.persianCalendarService.PersianCalendarNumeric(someDate);
    }
  }

  private getAllDoucmentById(docs: any) {
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
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit(true);
    });
  }

  confirmDoc() {
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
          let request = {
            ids: this.documentListSelected.map((k) => k.id),
            operation: "confirm",
          };
          this.manageFileService.acceptDocument(request).then(() => {
            this.toastr.success("تائید فایل با موفقیت انجام شد.");
            this.passEntry.emit(true);
          });
        }
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  onSelectCheckbox() {
    this.onAdditionalDownload(this.selectedItem.fileUuid);

    if (this.selectedItem.conflicts.length > 0) {
      this.reason = this.selectedItem.conflicts[0].conflictReasons[0].reason;
    } else {
      this.reason = null;
    }
    if (this.fileContradictionSets.type === "DAILY") {
      if (this.selectedItem.file.properties.length > 0) {
        this.selectedItem.file.properties.map((item) => {
          if (item.name === "documentNo") {
            this.docnumber = item.value.replace("[", "").replace("]", "");
          }
          if (item.name === "date") {
            this.docdate = item.value.replace("[", "").replace("]", "");
          }
          if (item.name === "branchCode") {
            this.docbranchcode = item.value.replace("[", "").replace("]", "");
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
        this.docnumber = "";
        this.docdate = "";
        this.docbranchcode = "";
        this.documentSetType = "";
        this.documentClass = "";
        this.documentType = "";
        this.documentDescription = "";
      }
    }
    if (this.fileContradictionSets.type === "CHAKAVAK") {
      if (this.selectedItem.file.properties.length > 0) {
        this.selectedItem.file.properties.map((item) => {
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
  }
}
