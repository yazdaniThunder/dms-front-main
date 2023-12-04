import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { finalize } from "rxjs/operators";
import { OtehrDocumentService } from "../../service/otherDocument.service";
import { OtherFileModel } from "../other-file.model";

@Component({
  selector: "app-update-other-document",
  templateUrl: "./update-other-document.component.html",
  styleUrls: ["./update-other-document.component.scss"],
})
export class UpdateOtherDocumentComponent implements OnInit {
  @Input()
  otherDocumentModel: OtherFileModel;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  public formGroup: FormGroup;

  otherDocumentType: any[] = [];
  fileStatusKeys: any[] = [];
  file: File = null;
  loading: boolean = false;
  fileStatusId: string;

  isLoading: boolean = false;
  content: any;
  imageURL: SafeUrl;

  showUpload: boolean = false;

  active: boolean = true;

  defaultStatusKey: any;

  constructor(
    private otehrDocumentService: OtehrDocumentService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.otherDocumentModel.otherDocumentFiles.forEach((k) => {
      this.otherDocumentType.push(k.otherDocumentType);
    });
    this.fileStatusKeys = this.otherDocumentModel.fileType.fileStatuses;

    this.formGroup = this.formBuilder.group({
      customerNumber: new FormControl(this.otherDocumentModel.customerNumber, [
        Validators.required,
      ]),
      fileNumber: new FormControl(this.otherDocumentModel.fileNumber),
    });
    this.active = this.otherDocumentModel.fileType.activateFileNumber;
    this.defaultStatusKey = this.otherDocumentModel.fileType.fileStatuses.find(
      (status) => status.isDefault
    );
    if (this.defaultStatusKey) {
      this.fileStatusId = this.defaultStatusKey.id;
    }
  }

  setFileStatusId(event: any) {
    this.fileStatusId = event.value.id;
  }

  onChange(event) {
    this.file = event.target.files[0];
  }

  onUpload(type) {
    let formdata = new FormData();
    formdata.append("file", this.file, this.file.name);
    formdata.append("id", type.id);
    if (this.fileStatusId) {
      formdata.append("fileStatusId", this.fileStatusId);
    } else {
      formdata.append("fileStatusId", type.fileStatus.id);
    }

    if (this.file === null) {
      this.toastr.info("لطفا فایل را انتخاب کنید.");
    } else {
      this.loading = !this.loading;
      this.otehrDocumentService
        .updateOther(formdata)
        .then(() => {
          this.loading = false;
          this.toastr.success("بارگذاری فایل با موفقیت انجام شد.");
          this.file = null;
          this.passEntry.emit("file");

          this.otehrDocumentService
            .getOtherById(this.otherDocumentModel.id)
            .then((res) => {
              this.otherDocumentModel = res;
            });

          this.showUpload = false;
        })
        .catch(() => {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
          this.passEntry.emit("file");
          this.file = null;
        });
    }
  }

  downloadFile(uuid) {
    this.isLoading = true;
    this.otehrDocumentService
      .showContent(uuid)
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

  editFile() {
    this.showUpload = true;
  }

  confirm() {
    let request;
    this.active
      ? (request = {
          id: this.otherDocumentModel.id,
          customerNumber: this.formGroup.value.customerNumber,
          fileNumber: this.formGroup.value.fileNumber,
        })
      : (request = {
          id: this.otherDocumentModel.id,
          customerNumber: this.formGroup.value.customerNumber,
        });

    this.otehrDocumentService
      .updateOtherInfo(request)
      .then(() => {
        this.toastr.success("تغییرات با موفقیت انجام شد.");
        this.passEntry.emit("file");

        this.otehrDocumentService
          .getOtherById(this.otherDocumentModel.id)
          .then((res) => {
            this.otherDocumentModel = res;
          });
      })
      .catch((err) => {
        this.passEntry.emit(false);
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }
}
