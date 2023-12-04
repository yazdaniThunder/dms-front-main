import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ConflictReasonService } from "src/app/main/service/conflict-reason.service";
import { DocumentReasonModel } from "../document-request.model";
import { RequestValidationTypeEnum } from "../request-validation-type.enum";

@Component({
  selector: "app-edit-reason-modal",
  templateUrl: "./edit-reason-modal.component.html",
  styleUrls: ["./edit-reason-modal.component.scss"],
})
export class EditReasonModalComponent implements OnInit {
  @Input()
  requestReasonModel: DocumentReasonModel;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public formGroup: FormGroup;

  public enumKeys: any[] = [];
  selectedValidation: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private conflictReasonService: ConflictReasonService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      title: new FormControl("", [Validators.required]),
    });

    if (this.requestReasonModel) {
      this.enumKeys = Object.keys(RequestValidationTypeEnum).map((key) => {
        const selected = this.isSelected(key);
        return {
          label: RequestValidationTypeEnum[key],
          value: key,
          selected: selected,
          selectedControl: new FormControl(selected),
        };
      });
    }

    this.selectedValidation = [
      ...this.selectedValidation,
      ...this.requestReasonModel.requestReasonValidations.map(
        (validation) => validation.fieldName
      ),
    ];
  }

  isSelected(value: string): boolean {
    return this.requestReasonModel.requestReasonValidations.some(
      (validation) => validation.fieldName === value
    );
  }

  toggleSelection(item: any) {
    item.selected = !item.selected;

    if (item.selected) {
      this.selectedValidation.push(item.value);
    } else {
      const index = this.selectedValidation.indexOf(item.value);
      if (index !== -1) {
        this.selectedValidation.splice(index, 1);
      }
    }
  }

  submit() {
    let request: DocumentReasonModel = {
      id: this.requestReasonModel.id,
      title: this.requestReasonModel.title,
      requestReasonValidations: this.selectedValidation.map((fieldName) => ({
        fieldName: fieldName,
        required: true,
      })),
    };


    this.conflictReasonService
      .editDocument(request)
      .then(() => {
        this.passEntry.emit(true);
        this.toastr.success("تغییرات با موفقیت ثبت شد.");
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور مجدد تلاش کنید!", "خطا");
        this.passEntry.emit(false);
      });
  }

  cancel() {
    this.passEntry.emit(false);
  }
}
