import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Accordion } from "primeng/accordion";
import { OtehrDocumentService } from "../../service/otherDocument.service";
import { OtherFileModel } from "../other-file.model";

@Component({
  selector: "app-other-file-modal-document",
  templateUrl: "./other-file-modal.component.html",
  styleUrls: ["./other-file-modal.component.scss"],
})
export class OtherFileModalComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private otehrDocumentService: OtehrDocumentService,
    private toastr: ToastrService
  ) {}
  @ViewChild("accordion", { static: false }) accordion: Accordion;

  @Output()
  passEntry: EventEmitter<any> = new EventEmitter();
  public formGroup: FormGroup;
  branchName: string = "";
  fullName: string = "";
  superVisor: string = "";

  typeKeys: any[] = [];
  documentTypeKeys: any[] = [];
  typeOfFile: any[] = [];

  otherFileModel: OtherFileModel;

  file: File = null;

  typeId: number;

  active: boolean = true;

  typeLabel: any = "";

  ngOnInit() {
    this.otehrDocumentService.getAllFileTypeList().then((res) => {
      this.typeOfFile = res;
      this.typeKeys = this.typeOfFile.map((k) => ({
        label: k.title,
        value: k.id,
        active: k.activateFileNumber,
      }));
    });

    this.formGroup = this.formBuilder.group({
      customerNumber: new FormControl("", [Validators.required]),
      fileNumber: new FormControl(""),
      fileTypeId: new FormControl("", [Validators.required]),
    });
    this.branchName = localStorage
      .getItem("branchCode")
      .concat("-" + localStorage.getItem("branchName"));
    this.fullName = localStorage.getItem("fullName");
    this.superVisor = localStorage.getItem("superVisor");
  }

  setType(event: any) {
    this.typeId = event.value.value;
    this.active = event.value.active;
    this.typeLabel = event.value.label;
  }

  confirm() {
    let request;
    this.active
      ? (request = {
          customerNumber: this.formGroup.value.customerNumber,
          fileNumber: this.formGroup.value.fileNumber,
          fileTypeId: this.typeId,
        })
      : (request = {
          customerNumber: this.formGroup.value.customerNumber,
          fileTypeId: this.typeId,
        });
    if (this.active && this.formGroup.value.fileNumber === "") {
      this.toastr.info("شماره پرونده باید تکمیل شود", "خطا");
    } else {
      this.otehrDocumentService
        .createOther(request)
        .then(() => {
          this.toastr.success("ثبت با موفقیت انجام شد.");
          this.passEntry.emit(true);
        })
        .catch((err) => {
          this.passEntry.emit(false);
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
    }
  }

  cancel() {
    this.passEntry.emit();
  }
}
