import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import swal from "sweetalert2";
import { ManageDocumentService } from "../../service/manage-document.service";
import { DocumentContradictionModel } from "../manage-contradiction-in-branch/document-contradiction.model";
import { DocumentFixConflictModel } from "../manage-document/document-fix-conflict.model";

@Component({
  selector: "app-fix-conflict",
  templateUrl: "./fix-conflict.component.html",
  styleUrls: ["./fix-conflict.component.scss"],
})
export class FixConflictComponent implements OnInit {
  @Input()
  documentContradictionModel: DocumentContradictionModel;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public description: string = "";

  constructor(
    private manageDocumentService: ManageDocumentService,
    private toastr: ToastrService,
    private persianCalendarService: PersianCalendarService
  ) {}

  ngOnInit() {}

  submit(formValues: any) {
    swal
      .fire({
        title: "آیا رفع مغایرت دسته اسناد را تایید می کنید؟",
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
          let request: DocumentFixConflictModel = {
            documentSetId: this.documentContradictionModel.id,
            description: formValues.description,
          };
          this.manageDocumentService
            .fixConflictDocumentSet(request)
            .then((res) => {
              this.passEntry.emit(true);
              this.toastr.success("رفع مغایرت دسته اسناد با موفقیت انجام شد.");
            });
        }
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        this.passEntry.emit(false);
      });
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      return this.persianCalendarService.PersianCalendarNumericFormat(sendDate);
    }
  }

  cancel() {
    this.passEntry.emit(false);
  }
}
