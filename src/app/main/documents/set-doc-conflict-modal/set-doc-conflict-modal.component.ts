import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { ManageCheckingService } from "../../service/manageChecking.service";
import { ConfirmStateModel } from "../manage-checking/confirm-state.model";
import { SetDocConflictModel } from "../manage-checking/set-doc-coflict.model";

@Component({
  selector: "app-set-doc-conflict-modal",
  templateUrl: "./set-doc-conflict-modal.component.html",
  styleUrls: ["./set-doc-conflict-modal.component.scss"],
})
export class SetDocConflictModalComponent implements OnInit, OnChanges {
  @Input()
  documentModel: ConfirmStateModel;
  @Input()
  enumKeysConflicts: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  @Input()
  customizeStyle: boolean = false;

  public setDocConflictModel: SetDocConflictModel = {};

  selectedReason: any[] = [];
  enumKeys: any;

  public formGroup: FormGroup;
  description: string;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private manageCheckingService: ManageCheckingService
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      description: new FormControl(""),
      conflictReasons: new FormControl(""),
    });
    this.getConflict();
    if (this.documentModel) {
      this.setDocConflictModel.documentId = this.documentModel.id;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getConflict();
    this.setDocConflictModel.documentId = changes.documentModel.currentValue.id;
    this.selectedReason = changes.documentModel.currentValue.conflicts;
  }

  getConflict() {
    this.enumKeys = this.enumKeysConflicts;
    // this.manageCheckingService.getConflictOfDocument().then((res) => {
    //   this.enumKeys = res.map((k) => ({
    //     label: k.reason,
    //     value: k.id,
    //   }));
    // });
  }

  submit() {
    let body = this.selectedReason.map((k) => k.value);

    swal
      .fire({
        title: "آیا ثبت مغایرت دسته اسناد را تایید می کنید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        inputPlaceholder: "وارد کنید",
        reverseButtons: true,
        confirmButtonText: "!بله تایید کن",
      })
      .then((result) => {
        if (result.value) {
          let request: SetDocConflictModel = {
            documentId: this.documentModel.id,
            description: this.description,
            conflictReasons: body,
          };
          this.manageCheckingService
            .setDocConflict(request)
            .then(() => {
              this.toastr.success("ثبت مغایرت  با موفقیت انجام شد.");
              this.passEntry.emit();
              this.selectedReason = [];
              this.description = "";
            })
            .catch(() => {
              this.toastr.error(
                "مشکل ارتباط با سرور، مجدد تلاش نمایید!",
                "خطا"
              );
              this.selectedReason = [];
            });
        }
      });
  }

  setReason(event: any) {
    this.setDocConflictModel.conflictReasons.map(
      (item) => (item = event.value.value)
    );
  }
}
