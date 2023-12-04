import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";
import { ManageCheckingService } from "../../service/manageChecking.service";
import { ConfirmStateModel } from "../manage-checking/confirm-state.model";
import { SetConflictModel } from "../manage-checking/set-conflict.model";

@Component({
  selector: "app-set-conflict-modal",
  templateUrl: "./set-conflict-modal.component.html",
  styleUrls: ["./set-conflict-modal.component.scss"],
})
export class SetConflictModalComponent implements OnInit {
  @Input()
  documentModel: ConfirmStateModel;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  public setConflictModel: SetConflictModel = {};

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
    this.setConflictModel.documentSetId = this.documentModel.id;
    this.getConflict();
    console.log("object", this.documentModel);
  }

  getConflict() {
    this.manageCheckingService
      .getConflictByType("DOCUMENT_SET", this.documentModel.type)
      .then((res) => {
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
          let request: SetConflictModel = {
            documentSetId: this.documentModel.id,
            description: this.registerDescription,
            conflictReasons: this.selectedReason.map((k) => k.value),
          };
          this.manageCheckingService
            .setConflict(request)
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
