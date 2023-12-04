import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ManageCheckingService } from "../../service/manageChecking.service";
import { ConfirmStateModel } from "../manage-checking/confirm-state.model";
import swal from "sweetalert2";
import { SetDocConflictModel } from "../manage-checking/set-doc-coflict.model";

@Component({
  selector: "app-update-doc-conflict-modal",
  templateUrl: "./update-doc-conflict-modal.component.html",
  styleUrls: ["./update-doc-conflict-modal.component.scss"],
})
export class UpdateDocConflictModalComponent implements OnInit {
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
    swal
      .fire({
        title: "آیا اصلاح مغایرت دسته اسناد را تایید می کنید؟",
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
          let conflictReasons: any[] = [];
          this.selectedReason.forEach((reason) => {
            conflictReasons.push({
              id: reason.value,
            });
          });
          let request: any = {
            id: this.documentModel.conflicts[0].id,
            documentId: this.documentModel.id,
            registerDescription: this.description,
            resolveDescription: this.description,
            conflictReasons: conflictReasons,
          };
          this.manageCheckingService
            .updateConflictDoc(request)
            .then(() => {
              this.toastr.success("اصلاح مغایرت  با موفقیت انجام شد.");
              this.passEntry.emit();
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        }
      });
  }

  cancel() {
    this.passEntry.emit();
  }
}
