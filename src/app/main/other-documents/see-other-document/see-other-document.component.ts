import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { OtehrDocumentService } from "../../service/otherDocument.service";
import { OtherFileModel } from "../other-file.model";

@Component({
  selector: "app-see-other-document",
  templateUrl: "./see-other-document.component.html",
  styleUrls: ["./see-other-document.component.scss"],
})
export class SeeOtherDocumentComponent implements OnInit {
  @Input()
  otherDocumentModel: OtherFileModel;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  active: boolean = true;
  fileProperties: { [uuid: string]: { link: string; openFile: boolean } } = {};

  constructor(private otehrDocumentService: OtehrDocumentService) {}

  ngOnInit() {
    this.otehrDocumentService
      .getOtherById(this.otherDocumentModel.id)
      .then(() => {
        this.passEntry.emit("file");
      });
    this.active = this.otherDocumentModel.fileType.activateFileNumber;
    for (const file of this.otherDocumentModel.otherDocumentFiles) {
      this.fileProperties[file.fileUuid] = {
        link: null,
        openFile: false,
      };
    }
    this.onAdditionalDownload();
  }

  public onAdditionalDownload(): void {
    for (const file of this.otherDocumentModel.otherDocumentFiles) {
      // Get the file properties for this file
      const fileProperty = this.fileProperties[file.fileUuid];
      fileProperty.link = null;
      fileProperty.openFile = false;

      this.otehrDocumentService
        .showContent(file.fileUuid)
        .pipe()
        .subscribe((response) => {
          fileProperty.link = response.url;
          let blob: Blob = response.body as Blob;
          let a = document.createElement("a");
          a.href = window.URL.createObjectURL(blob);
          this.openFile(file.fileUuid); // Open the file viewer for this file
        });
    }
  }

  openFile(uuid: string): void {
    this.fileProperties[uuid].openFile = true;
  }
}
