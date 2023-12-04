import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { finalize } from "rxjs/operators";
import { DocumentSetTypeEnum } from "../../../brnaches/manage-document/document-set-type.enum";
import { DocumentRequestModel } from "../../../brnaches/request-modal/document-request.model";
import { SendToBranchModel } from "../../../brnaches/request-modal/send-to-branch.model";
import { DocumentRequestService } from "../../../service/document-request.service";

@Component({
  selector: "app-send-branch-modal",
  templateUrl: "./send-branch-modal.component.html",
  styleUrls: ["./send-branch-modal.component.scss"],
})
export class SendBranchModalComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  selectedType: any;
  enumKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));
  public formGroup: FormGroup;
  branchName: string = "";
  file: File = null;
  public sendModel = new SendToBranchModel();
  @Input() requestModel: DocumentRequestModel;
  selectedDoc: any;
  imageURL: SafeUrl;
  isLoading: boolean = false;
  content: any;
  open: boolean = false;
  fileEdit: File = null;
  shortLink: string = "";
  loading: boolean = false;
  private ngbModalRef: NgbModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private documentRequestService: DocumentRequestService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      type: new FormControl(""),
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
      reciveDescription: new FormControl(""),
    });
  }

  setDate(event: any) {
    if (event > new Date()) {
      this.sendModel.expiryDate = event;
    } else if (event === null || event === undefined) {
      this.toastr.info("لطفا فیلد تاریخ را وارد کنید", "خطا");
    } else {
      this.toastr.error("تاریخ اعتبار معتبر نیست!", "خطا");
    }
  }

  cancel() {
    this.passEntry.emit();
  }

  onChange(event) {
    this.file = event.target.files[0];
  }

  public onSubmit() {
    if (
      this.sendModel.expiryDate === undefined ||
      this.sendModel.expiryDate === null
    ) {
      this.toastr.info("لطفا فیلد تاریخ را وارد کنید", "خطا");
    } else {
      this.sendModel.id = this.requestModel.id;
      this.documentRequestService
        .sendDocumentToBranch(this.sendModel)
        .then(() => {
          this.toastr.success("ارسال به شعبه با موفقیت انجام شد.");
          this.passEntry.emit();
        })
        .catch((err) => {
          if (err.status === 400) {
            this.toastr.error("تاریخ اعتبار معتبر نیست!", "خطا");
          } else {
            this.passEntry.emit(false);
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
          }
        });
    }
  }

  public getContent(id: string): void {
    this.isLoading = true;
    this.documentRequestService
      .showContent(id)
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

  getById() {
    this.documentRequestService
      .getDocById(this.requestModel.id)
      .then((res) => (this.requestModel = res))
      .catch((err) => this.modalService.dismissAll);
  }

  onChangeEdit(event) {
    this.fileEdit = event.target.files[0];
  }

  onUploadEdit() {
    if (this.fileEdit === null) {
      this.toastr.info("لطفا فایل را انتخاب کنید.");
    } else {
      this.loading = !this.loading;
      this.documentRequestService
        .uploadEdit(this.selectedDoc.uuid, this.fileEdit, this.requestModel.id)
        .subscribe(
          (event: any) => {
            if (typeof event === "object") {
              this.loading = false;
              this.toastr.success("بارگذاری فایل با موفقیت انجام شد.");
              this.ngbModalRef.dismiss();
              this.getById();
            }
          },
          (err) => {
            if (err.error.message === "File format must be zip") {
              this.loading = false;
              this.toastr.info("فایل بارگذاری شده باید zip باشد");
              this.fileEdit = null;
            } else {
              this.loading = false;
              this.toastr.error(
                "مشکل ارتباط با سرور، مجدداً تلاش نمایید!",
                "خطا"
              );
              this.ngbModalRef.close();
            }
          }
        );
    }
  }

  openModalClick(content, selectedDoc?: any) {
    this.selectedDoc = selectedDoc;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then(() => {
      this.passEntry.emit();
    });
  }
}
