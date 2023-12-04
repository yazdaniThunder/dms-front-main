import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { ManageCheckingService } from "../../service/manageChecking.service";
import { ConfirmStateModel } from "../manage-checking/confirm-state.model";
import { SetAllConflictModel } from "../manage-checking/set-conflict.model";

@Component({
  selector: "app-set-all-conflict-modal",
  templateUrl: "./set-all-conflict-modal.component.html",
  styleUrls: ["./set-all-conflict-modal.component.scss"],
})
export class SetAllConflictModalComponent implements OnInit {
  @Input()
  documentModel: ConfirmStateModel[];
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  public setConflictModel: SetAllConflictModel = {};

  selectedReason: any[] = [];

  enumKeys: any;

  public formGroup: FormGroup;
  registerDescription: string;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private manageCheckingService: ManageCheckingService
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      registerDescription: new FormControl(""),
      conflictReasons: new FormControl(""),
    });
    this.getConflict();
  }

  getConflict() {
    this.manageCheckingService.getConflictOfDocumentSet().then((res) => {
      this.enumKeys = res.map((k) => ({
        label: k.reason,
        value: k.id,
      }));
    });
  }

  submit() {
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
          let request: SetAllConflictModel = {
            documentSetIds: this.documentModel.map((doc) => doc.id),
            description: this.registerDescription,
            conflictReasons: this.selectedReason.map((k) => k.value),
          };
          this.manageCheckingService
            .setAllConflict(request)
            .then(() => {
              this.toastr.success("ثبت مغایرت  با موفقیت انجام شد.");
              this.passEntry.emit(true);
            })
            .catch(() => {
              this.toastr.error(
                "مشکل ارتباط با سرور، مجدد تلاش نمایید!",
                "خطا"
              );
              this.passEntry.emit(false);
            });
        }
      });
  }

  cancel() {
    this.passEntry.emit(false);
  }

  setReason(event: any) {
    this.setConflictModel.conflictReasons.map(
      (item) => (item.reason = event.value.value)
    );
  }
}
