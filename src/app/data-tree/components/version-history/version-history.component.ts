import { Component, Input, OnInit } from "@angular/core";
import { DocumentModel } from "../../models/Document.model";
import { HistoryService } from "../../../main/service/history.service";
import { Version } from "./Version";
import swal from "sweetalert2";
import { FileService } from "../../services/file.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-version-history",
  templateUrl: "./version-history.component.html",
  styleUrls: ["./version-history.component.css"],
})
export class VersionHistoryComponent implements OnInit {
  even: Version[] = [];
  @Input()
  document: DocumentModel;
  versionList: Version[];
  VersionURL: SafeUrl;
  content: any;
  versionId2: number;
  private ngbModalRef: NgbModalRef;

  constructor(
    private historyService: HistoryService,
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private toastr: ToastrService // private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllVersions(this.document.uuid);
  }
  getAllVersions(uuid: string) {
    this.historyService.GetVersionHistory(uuid).then((res) => {
      if (res.length === undefined) {
        this.versionList = [res];
      } else {
        this.versionList = res;
      }
    });
  }

  downloadVersion(versionId: string) {
    let name = this.document.path;
    if (this.document && this.document.name) {
      name = this.document.name;
    } else {
      name = this.document.path.substr(
        this.document.path.lastIndexOf("/"),
        this.document.path.length
      );
    }
    this.versionId2 = parseFloat(versionId);
    if (this.versionId2 === 1) {
      this.fileService.getImage(this.document.uuid).subscribe((res: Blob) => {
        this.downloadBuffer(res, name);
      });
    } else {
      this.fileService
        .GetContentByVersion(this.document.uuid, versionId)
        .subscribe((res: Blob) => {
          this.downloadBuffer(res, name);
        });
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
    this.VersionURL = URL.createObjectURL(
      new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
    );
    a.download = name;
    a.click();
  }

  restoreVersion(name) {
    this.historyService
      .RestoreVersion(this.document.uuid, name)
      .then((res: any) => {
        this.toastr.success("ورژن با موفقیت بازگردانی شد");
      })
      .catch((error) => {
        this.toastr.error("خطا در بازگردانی ورژن", "خطا");
      });
  }

  uploadFileModal(content) {
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  getUploadedDoc(event: any) {
    this.ngbModalRef.close();
    this.getAllVersions(this.document.uuid);
  }

  deleteVersion() {
    swal
      .fire({
        title: "آیا از حذف نسخه اطمینان دارید؟",
        text: "!در صورت تایید همه نسخه ها، به جز نسخه آخر حذف خواهد شد",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله حذف کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.historyService
            .PurgeVersion(this.document.uuid)
            .then((res: any) => {
              this.toastr.success("ورژن با موفقیت حذف شد");

              this.getAllVersions(this.document.uuid);
            })
            .catch((error) => {
              this.toastr.error("خطا در حذف ورژن", "خطا");
            });
        }
      });
  }
}
