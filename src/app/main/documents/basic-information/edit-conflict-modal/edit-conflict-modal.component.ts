import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
import {
  ConflictAddReasonModel,
  ConflictReasonModel,
} from "../conflict-reason.model";

@Component({
  selector: "app-edit-conflict-modal",
  templateUrl: "./edit-conflict-modal.component.html",
  styleUrls: ["./edit-conflict-modal.component.scss"],
})
export class EditConflictModalComponent implements OnInit {
  @Input()
  conflictSetModel: ConflictReasonModel;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public formGroup: FormGroup;

  selectedType: any;

  enumKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));

  typeEnumKeys = Object.keys(GeneralTypeEnum).map((key) => ({
    label: GeneralTypeEnum[key],
    value: key,
  }));

  constructor(
    private formBuilder: FormBuilder,
    private conflictReasonService: ConflictReasonService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.selectedType = {
      label: DocumentSetTypeEnum[this.conflictSetModel.documentSetType],
      value: this.conflictSetModel.documentSetType,
    };
    this.formGroup = this.formBuilder.group({
      documentSetType: new FormControl(""),
      reason: new FormControl("", [Validators.required]),
      type: new FormControl(""),
    });
  }

  submit() {
    let request: ConflictAddReasonModel = {
      id: this.conflictSetModel.id,
      documentSetType: this.selectedType.value,
      reason: this.conflictSetModel.reason,
      type: this.conflictSetModel.type,
    };
    this.conflictReasonService
      .editConflict(request)
      .then(() => {
        this.passEntry.emit(true);
        this.toastr.success("تغییرات با موفقیت ثبت شد.");
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور مجدد تلاش کنید!", "خطا");
        this.passEntry.emit(false);
      });
  }

  getGeneralType(type: GeneralTypeEnum) {
    return GeneralTypeEnum[type];
  }

  cancel() {
    this.passEntry.emit(false);
  }
}
