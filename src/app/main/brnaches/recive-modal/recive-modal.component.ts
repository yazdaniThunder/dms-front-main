import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { finalize } from "rxjs/operators";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import { DocumentRequestService } from "../../service/document-request.service";
import { FileContradictionModel } from "../manage-contradiction-in-branch/file-contradiction.model";

@Component({
  selector: "app-recive-modal",
  templateUrl: "./recive-modal.component.html",
  styleUrls: ["./recive-modal.component.scss"],
})
export class ReciveModalComponent implements OnInit {
  @Input()
  documentSetModel: FileContradictionModel;
  @Input()
  officeFiles: { uuid: string; name: string; type: string }[]; // Assuming this is your list of files with type
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  isLoading: boolean = false;
  // Store link and openFile for each file
  fileProperties: { [uuid: string]: { link: string; openFile: boolean } } = {};

  content: any;
  imageURL: SafeUrl;

  constructor(
    private documentRequestService: DocumentRequestService,
    private toastr: ToastrService,
    private persianCalendarService: PersianCalendarService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getRecive();
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      return this.persianCalendarService.PersianCalendarNumericFormat(sendDate);
    }
  }

  getRecive() {
    this.documentRequestService
      .getReciveBranch(this.documentSetModel.id)
      .then((res: any) => {
        this.officeFiles = res.officeFiles;
        this.passEntry.emit(true);

        // Initialize fileProperties for each file
        for (const file of this.officeFiles) {
          this.fileProperties[file.uuid] = {
            link: null,
            openFile: false,
          };
        }
        if (this.documentSetModel.requestType !== "GROUP_DOCUMENT_IMAGE") {
          this.onAdditionalDownload();
        }
      })
      .catch((err) => {
        if (err.status === 403) {
          this.toastr.error("تاریخ اعتبار مشاهده معتبر نمیباشد !", "خطا");
        } else {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        }
      });
  }

  public onAdditionalDownload(): void {
    for (const file of this.officeFiles) {
      // Get the file properties for this file
      const fileProperty = this.fileProperties[file.uuid];
      fileProperty.link = null;
      fileProperty.openFile = false;

      this.documentRequestService
        .showContent(file.uuid)
        .pipe()
        .subscribe((response) => {
          fileProperty.link = response.url;
          let blob: Blob = response.body as Blob;
          let a = document.createElement("a");
          a.href = window.URL.createObjectURL(blob);
          this.openFile(file.uuid); // Open the file viewer for this file
        });
    }
  }

  // Function to open the file viewer for a specific file
  openFile(uuid: string): void {
    this.fileProperties[uuid].openFile = true;
  }

  // Function to close the file viewer for a specific file
  closeFile(uuid: string): void {
    this.fileProperties[uuid].openFile = false;
  }

  // Function to check if the file type is PDF, TIF, or TIFF
  isPdfOrTif(fileType: string): boolean {
    return (
      fileType === "application/pdf" ||
      fileType === "image/tif" ||
      fileType === "image/tiff"
    );
  }

  downloadFile() {
    this.isLoading = true;
    this.documentRequestService
      .showContent(this.documentSetModel.officeFiles[0].uuid)
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
