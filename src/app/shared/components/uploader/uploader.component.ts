import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FileUploadService } from "../../services/file-upload.service";
import { DocumentModel } from "../../../data-tree/models/Document.model";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { LoadingService } from "../../../main/service/Loading.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-uploader",
  templateUrl: "./uploader.component.html",
  styleUrls: ["./uploader.component.css"],
})
export class UploaderComponent implements OnInit {
  // Variable to store shortLink from api response
  shortLink = "";
  loading = false; // Flag variable
  file: File = null; // Variable to store file
  @Input()
  path: string;
  @Input()
  isUpdate: boolean;
  @Input()
  document: DocumentModel;
  uploadedDoc: DocumentModel;
  @Output()
  eventEmitter: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();
  content: any;
  imageURL: SafeUrl;
  result: any;
  base64Content: any;

  constructor(
    private sanitizer: DomSanitizer,
    private fileUploadService: FileUploadService,
    private loadingService: LoadingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  // On file Select
  onChange(event) {
    this.file = event.target.files[0];
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
    if (!this.isUpdate) {
      this.uploadNewFile();
    } else {
      this.updateFile();
    }
  }

  downloadBuffer(arrayBuffer, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
    );
    this.content = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(
        new Blob([arrayBuffer], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        })
      )
    );
    this.imageURL = URL.createObjectURL(
      new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
    );
    a.download = name;
    a.click();
  }

  checkFileIcon(title: string) {
    if (title.substr(title.length - 4) === "docx") {
      return "fa word-small  fa-file-word-o";
    } else if (title.substr(title.length - 4) === "xlsx") {
      return "fa excel-small fa-file-excel-o";
    } else if (title.substr(title.length - 3) === "pdf") {
      return "fa pdf-small fa-file-pdf-o";
    } else if (
      title.substr(title.length - 3) === "PNG" ||
      title.substr(title.length - 3) === "jpg"
    ) {
      return "fa image-small fa-file-image-o";
    } else {
      return "fa file-small fa-file";
    }
  }

  private uploadNewFile() {
    this.loadingService.trueLoadingCounter();
    this.fileUploadService
      .uploadAndProgressSingle(this.file, this.path)
      .then((res: any) => {
        this.loadingService.decreaseLoading();
        // this.downloadBuffer(res, 'test.png');
        this.uploadedDoc = res;
        this.file = null;
        this.eventEmitter.emit(this.uploadedDoc);
        this.loading = false; // Flag variable
        this.toastr.success("عملیات بارگذاری با موفقیت انجام شد");
      })
      .catch((error) => {
        this.loadingService.resetLoadingCounter();
      });
  }

  private updateFile() {
    this.fileUploadService.checkOut(this.document.uuid).then((res: any) => {
      this.fileUploadService
        .checkIn(this.file, this.document.uuid)
        .subscribe((resault: any) => {
          // this.downloadBuffer(res, 'test.png');
          this.uploadedDoc = res;
          this.eventEmitter.emit(this.uploadedDoc);
          this.toastr.success("عملیات بارگذاری با موفقیت انجام شد");

          this.loading = false; // Flag variable)
        });
    });
  }
}
