import { Component, EventEmitter, OnInit, Output } from "@angular/core";
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
  selector: "app-add-reason-modal",
  templateUrl: "./add-reason-modal.component.html",
  styleUrls: ["./add-reason-modal.component.scss"],
})
export class AddReasonModalComponent implements OnInit {
  public formGroup: FormGroup;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public requestReasonModel: DocumentReasonModel = {};
  selectedValidation: any[] = [];
  enumKeys = Object.keys(RequestValidationTypeEnum).map((key) => ({
    label: RequestValidationTypeEnum[key],
    value: key,
    selectedControl: new FormControl(false),
  }));

  constructor(
    private formBuilder: FormBuilder,
    private conflictReasonService: ConflictReasonService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const formGroupControls = {};
    this.enumKeys.forEach((item) => {
      formGroupControls[item.value] = item.selectedControl;
    });

    this.formGroup = this.formBuilder.group({
      title: new FormControl("", [Validators.required]),
      requestReasonValidations: new FormControl([]),
      ...formGroupControls, // Add the form controls for checkboxes dynamically
    });

    this.requestReasonModel = {
      requestReasonValidations: [],
    };
  }

  toggleSelection(item: any) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedValidation.push(item.value);
    }
  }

  onSubmit() {
    if (this.selectedValidation.length > 0) {
      this.requestReasonModel.requestReasonValidations =
        this.selectedValidation.map((validation) => ({
          fieldName: validation,
          required: true,
        }));
    }

    this.conflictReasonService
      .createReason(this.requestReasonModel)
      .then(() => {
        this.passEntry.emit(true);
        this.toastr.success("ایجاد دلیل درخواست با موفقیت انجام شد.");
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
