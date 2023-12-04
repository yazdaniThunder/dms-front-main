import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { DocumentRequestModel } from "src/app/main/brnaches/request-modal/document-request.model";
import { DocumentRequestService } from "src/app/main/service/document-request.service";

@Component({
  selector: "app-edit-date-request",
  templateUrl: "./edit-date-request.component.html",
  styleUrls: ["./edit-date-request.component.scss"],
})
export class EditDateRequestComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() requestModel: DocumentRequestModel;
  expireDate: string;

  constructor(
    private toastr: ToastrService,
    private documentRequestService: DocumentRequestService
  ) {}

  ngOnInit() {
    this.expireDate = this.requestModel.expiryDate
      ? this.requestModel.expiryDate.split("T", 1)
      : null;
  }

  setDate(event: any) {
    if (event > new Date()) {
      this.expireDate = event;
    } else if (event === null || event === undefined) {
      this.toastr.info("لطفا فیلد تاریخ را وارد کنید", "خطا");
    } else {
      this.toastr.error("تاریخ اعتبار معتبر نیست!", "خطا");
    }
  }

  submit() {
    let request = {
      id: this.requestModel.id,
      expiryDate: this.expireDate,
      receiveDescription: this.requestModel.receiveDescription,
    };
    if (this.expireDate === undefined) {
      this.toastr.info("لطفا فیلد تاریخ را وارد کنید", "خطا");
    } else {
      this.documentRequestService
        .editExpireDate(request)
        .then((res) => {
          this.passEntry.emit(true);
          this.toastr.success("تغییرات با موفقیت ثبت شد.");
        })
        .catch((err) => {
          this.passEntry.emit(false);
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
    }
  }

  cancel() {
    this.passEntry.emit(false);
  }
}
