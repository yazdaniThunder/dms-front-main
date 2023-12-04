import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ConfirmStateModel } from "../manage-checking/confirm-state.model";
import { SetDocConflictModel } from "../manage-checking/set-doc-coflict.model";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ManageCheckingService } from "../../service/manageChecking.service";
import swal from "sweetalert2";

@Component({
  selector: "app-set-conflict-document",
  templateUrl: "./set-conflict-document.component.html",
  styleUrls: ["./set-conflict-document.component.scss"],
})
export class SetConflictDocumentComponent implements OnInit {
  @Input()
  documentModel: ConfirmStateModel;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

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
    this.setDocConflictModel.documentId = this.documentModel.id;
    this.getConflict();
  }

  getConflict() {
    this.manageCheckingService.getConflictOfDocument().then((res) => {
      this.enumKeys = res.map((k) => ({
        label: k.reason,
        value: k.id,
      }));
    });
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

  cancel() {
    this.passEntry.emit();
  }

}
