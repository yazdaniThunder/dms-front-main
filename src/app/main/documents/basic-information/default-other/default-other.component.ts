import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { OtehrDocumentService } from "src/app/main/service/otherDocument.service";
import { FileTypeModel } from "../file-type.model";

@Component({
  selector: "app-default-other",
  templateUrl: "./default-other.component.html",
  styleUrls: ["./default-other.component.scss"],
})
export class DefaultOtherComponent implements OnInit {
  @Input()
  fileTypeModel: FileTypeModel;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public formGroup: FormGroup;

  statusKeys: any[] = [];
  defaultStatusKey: any;

  constructor(
    private formBuilder: FormBuilder,
    private otehrDocumentService: OtehrDocumentService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.statusKeys = this.fileTypeModel.fileStatuses.map((k) => ({
      id: k.id,
      title: k.title,
      isDefault: k.isDefault,
    }));

    this.defaultStatusKey = this.statusKeys.find((status) => status.isDefault);

    this.formGroup = this.formBuilder.group({
      fileStatus: new FormControl(""),
    });
  }

  setFileStatusId(event: any) {
    this.fileTypeModel.fileStatuses.forEach((k) => (k.isDefault = false));
    event.value.isDefault = true;
    this.defaultStatusKey = event.value;
  }

  cancel() {
    this.passEntry.emit(false);
  }

  submit() {
    this.fileTypeModel.fileStatuses = this.fileTypeModel.fileStatuses.filter(
      (k) => k.id !== this.defaultStatusKey.id
    );

    let result = this.fileTypeModel.fileStatuses.map((item) => {
      const { fileType, ...rest } = item;
      return rest;
    });

    let results = this.fileTypeModel.otherDocumentTypes.map((item) => {
      const { fileType, ...rest } = item;
      return rest;
    });

    let request: FileTypeModel = {
      id: this.fileTypeModel.id,
      fileStatuses: [...result, this.defaultStatusKey],
      otherDocumentTypes: results,
    };

    this.otehrDocumentService
      .updateFileType(request)
      .then(() => {
        this.passEntry.emit(true);
        this.toastr.success("تغییرات با موفقیت ثبت شد.");
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور مجدد تلاش کنید!", "خطا");
        this.passEntry.emit(false);
      });
  }
}
