import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { finalize } from "rxjs/operators";
import {
  RequestType,
  RequestTypeAdmin,
} from "src/app/main/brnaches/request-modal/request-modal.component";
import { RequestInDocService } from "src/app/main/service/request-in-doc-service";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { DocumentSetTypeEnum } from "../../../brnaches/manage-document/document-set-type.enum";
import { DocumentSetModel } from "../../../brnaches/manage-document/document-set.model";
import { DocumentRequestModel } from "../../../brnaches/request-modal/document-request.model";

@Component({
  selector: "app-confirm-request-modal",
  templateUrl: "./confirm-request-modal.component.html",
  styleUrls: ["./confirm-request-modal.component.scss"],
})
export class ConfirmRequestModalComponent implements OnInit {
  @Output()
  passEntry: EventEmitter<any> = new EventEmitter();
  @Input()
  requestModel: DocumentRequestModel;
  selectedType: any;
  enumKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));
  public formGroup: FormGroup;
  private ngbModalRef: NgbModalRef;
  public documentSetModel: DocumentSetModel = {};
  branchName: string = "";
  file: File = null;
  requestKeys = Object.keys(RequestType).map((key) => ({
    label: RequestType[key],
    value: key,
  }));
  imageURL: SafeUrl;
  isLoading: boolean = false;
  content: any;
  open: boolean = false;
  description: string = "";
  branch: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private persianCalendarService: PersianCalendarService,
    private requestInDocService: RequestInDocService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      documentType: new FormControl(""),
      number: new FormControl(""),
      amount: new FormControl(""),
      date: new FormControl(""),
      branchCode: new FormControl(""),
      requestDescription: new FormControl(""),
      requestType: new FormControl(""),
      customerNumber: new FormControl(""),
      fileNumber: new FormControl(""),
      file: new FormControl(""),
      viewValidateDate: new FormControl(""),
      receiveDescription: new FormControl(""),
    });
    this.branchName = localStorage
      .getItem("branchName")
      .concat("-" + localStorage.getItem("branchCode"));
    this.requestModel.documentBranchName != null
      ? (this.branch =
          this.requestModel.documentBranchName +
          " - " +
          this.requestModel.documentBranchCode)
      : (this.branch = "");
  }

  setDate(event: any) {
    this.requestModel.documentDate = event;
  }

  getType(type: DocumentSetTypeEnum) {
    return DocumentSetTypeEnum[type];
  }

  getTypeDoc(type: RequestTypeAdmin) {
    return RequestTypeAdmin[type];
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      var someDate = new Date(sendDate);
      return this.persianCalendarService.PersianCalendarNumeric(someDate);
    }
  }

  confirmDoc() {
    let request = {
      description: "",
      ids: [this.requestModel.id],
      operation: "confirm",
    };
    swal
      .fire({
        title: "آیا از تائید اطمینان دارید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله تایید کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.requestInDocService.documentOperation(request).then(() => {
            this.toastr.success("تائید  با موفقیت انجام شد.");
            this.passEntry.emit();
          });
        }
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        this.passEntry.emit();
      });
  }

  public cancelDoc() {
    let request = {
      description: this.description,
      ids: [this.requestModel.id],
      operation: "reject",
    };
    swal
      .fire({
        title: "آیا از عدم تائید اطمینان دارید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.requestInDocService.documentOperation(request).then(() => {
            this.toastr.success("عدم تائید  با موفقیت انجام شد.");
            this.passEntry.emit();
            this.ngbModalRef.close();
          });
        }
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        this.passEntry.emit();
        this.ngbModalRef.close();
      });
  }

  cancel() {
    this.passEntry.emit();
  }

  setType(event: any) {
    this.requestModel.documentType = event.value.value;
  }

  setRequest(event: any) {
    this.requestModel.requestType = event.value.value;
  }

  onChange(event) {
    this.file = event.target.files[0];
  }

  submitNew() {
    this.ngbModalRef.close();
    this.passEntry.emit();
  }

  openModalFileClick(content) {
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  public getContent(): void {
    this.isLoading = true;
    this.requestInDocService
      .showContent(this.requestModel.branchFileUuid)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response) => {
        let FileName = response.headers
          .get("content-disposition")
          .toString()
          .split("=")[1];
        let blob: Blob = response.body as Blob;
        let a = document.createElement("a");

        a.href = URL.createObjectURL(
          new Blob([blob], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          })
        );
        this.content = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(
            new Blob([blob], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            })
          )
        );
        this.imageURL = URL.createObjectURL(
          new Blob([blob], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          })
        );
        a.download = FileName;
        a.click();
      });
  }
}
