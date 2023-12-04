import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { OtehrDocumentService } from "src/app/main/service/otherDocument.service";
import { FileTypeModel } from "../file-type.model";

@Component({
  selector: "app-add-other-modal",
  templateUrl: "./add-other-modal.component.html",
  styleUrls: ["./add-other-modal.component.scss"],
})
export class AddOtherModalComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public formGroup: FormGroup;
  fileTypeModel: FileTypeModel = {};
  fileStatus: any[] = [];
  documentType: any[] = [];
  previous: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private otehrDocumentService: OtehrDocumentService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      activateFileNumber: new FormControl(true),
    });
  }

  cancel() {
    this.passEntry.emit(false);
  }

  submit() {
    let request: FileTypeModel = {
      title: this.fileTypeModel.title,
      fileStatuses: this.fileStatus,
      otherDocumentTypes: this.documentType,
      activateFileNumber: this.formGroup.value.activateFileNumber,
    };
    this.otehrDocumentService
      .createFileType(request)
      .then(() => {
        this.passEntry.emit(true);
        this.toastr.success("تغییرات با موفقیت ثبت شد.");
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور مجدد تلاش کنید!", "خطا");
        this.passEntry.emit(false);
      });
  }

  editingFileStatus: any = null;
  fileStatusInput: string = "";

  addFileStatus(): void {
    if (this.fileStatusInput.trim()) {
      this.fileStatus.push({
        title: this.fileStatusInput.trim(),
        isDefault: false,
      });
      this.fileStatusInput = ""; // Clear the input field after adding
    }
  }

  removeFileStatus(fileStatus: number): void {
    // Remove the branch code from the array
    const index = this.fileStatus.indexOf(fileStatus);
    if (index >= 0) {
      this.fileStatus.splice(index, 1);
    }
  }

  updateFileStatus(): void {
    if (this.editingFileStatus) {
      const index = this.fileStatus.findIndex(
        (fs) => fs.title === this.previous
      );
      if (index !== -1) {
        this.fileStatus[index] = { ...this.editingFileStatus };
        this.editingFileStatus = null;
        this.previous = null;
      } else {
        // If the item is not found, it means it's a new item
        this.fileStatus.push({ ...this.editingFileStatus });
        this.editingFileStatus = null;
        this.previous = null;
      }
    }
  }

  editFileStatus(filestatus: any): void {
    this.editingFileStatus = { ...filestatus };
    this.previous = this.editingFileStatus.title;
  }

  cancelEditFileStatus(): void {
    this.editingFileStatus = null;
    this.previous = null;
  }

  selectFileStatus(selectedFileStatus: any): void {
    this.fileStatus.forEach((item) => {
      item.isDefault = item === selectedFileStatus;
    });
  }

  editingDocumentType: any = null;
  documentTypeInput: string = "";


  addDocumentType(): void {
    if (this.documentTypeInput.trim()) {
      this.documentType.push({
        title: this.documentTypeInput.trim(),
        isDefault: false,
      });
      this.documentTypeInput = ""; // Clear the input field after adding
    }
  }
  removeDocumentType(documentType: number): void {
    // Remove the branch code from the array
    const index = this.documentType.indexOf(documentType);
    if (index >= 0) {
      this.documentType.splice(index, 1);
    }
  }

  selectDocumentType(index: number): void {
    this.documentType.forEach((item, i) => {
      item.isDefault = i === index;
    });
  }

  updateDocumentType(): void {
    if (this.editingDocumentType) {
      const index = this.documentType.findIndex(
        (fs) => fs.title === this.previous
      );
      if (index !== -1) {
        this.documentType[index] = { ...this.editingDocumentType };
        this.editingDocumentType = null;
        this.previous = null;
      } else {
        // If the item is not found, it means it's a new item
        this.documentType.push({ ...this.editingDocumentType });
        this.editingDocumentType = null;
        this.previous = null;
      }
    }
  }

  editDocumentType(documenttype: any): void {
    this.editingDocumentType = { ...documenttype };
    this.previous = this.editingDocumentType.title;
  }

  cancelEditDocumentType(): void {
    this.editingDocumentType = null;
    this.previous = null;
  }
}
