import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {
  DocumentSetTypeEnum,
  GeneralTypeEnum,
} from "src/app/main/brnaches/manage-document/document-set-type.enum";
import { ConflictReasonService } from "src/app/main/service/conflict-reason.service";
import { ConflictAddReasonModel } from "../conflict-reason.model";

@Component({
  selector: "app-add-conflict-modal",
  templateUrl: "./add-conflict-modal.component.html",
  styleUrls: ["./add-conflict-modal.component.scss"],
})
export class AddConflictModalComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  enumKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));
  typeEnumKeys = Object.keys(GeneralTypeEnum).map((key) => ({
    label: GeneralTypeEnum[key],
    value: key,
  }));
  public formGroup: FormGroup;
  public conflictSetModel: ConflictAddReasonModel = {};
  isDocumentSet: boolean = true;

  typeLabel: any = "";
  documentSetTypeLabel: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private conflictReasonService: ConflictReasonService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      documentSetType: new FormControl("", [Validators.required]),
      reason: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
    });
  }

  setType(event: any) {
    if (event.value.value == "ALL") {
      this.conflictSetModel.documentSetType = null;
    } else {
      this.conflictSetModel.documentSetType = event.value.value;
      this.documentSetTypeLabel = event.value.label;
    }
  }

  setGeneralType(event: any) {
    this.conflictSetModel.type = event.value.value;
    this.typeLabel = event.value.label;
    this.checkValidations(event);
  }

  private checkValidations(event: any) {
    let idx = event.value.value;
    this.clearAllValidators();
    if (idx === "DOCUMENT_SET") {
      this.formGroup.controls["documentSetType"].setValidators([
        Validators.required,
      ]);

      this.formGroup.controls["documentSetType"].updateValueAndValidity();
    }
  }

  clearAllValidators() {
    this.formGroup.controls["documentSetType"].clearValidators();

    this.formGroup.controls["documentSetType"].updateValueAndValidity();
  }

  onSubmit() {
    this.conflictReasonService
      .createConflict(this.conflictSetModel)
      .then(() => {
        this.passEntry.emit(true);
        this.toastr.success("ایجاد مغایرت با موفقیت انجام شد.");
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        this.passEntry.emit(false);
      });
  }

  cancel() {
    this.passEntry.emit(false);
  }
}
