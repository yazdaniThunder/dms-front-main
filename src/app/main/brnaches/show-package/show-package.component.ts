import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { TypeModel } from "../manage-document/typeModel";
import { PersianCalendarService } from "../../../shared/services/persian-calendar.service";
import { DocumentSetTypeEnum } from "../manage-document/document-set-type.enum";
import { ManageFileService } from "../../service/manage-file.service";
import { ToastrService } from "ngx-toastr";
import { StatusSetTypeEnum } from "../manage-contradiction-in-branch/status-set-type.enum";
import { FileContradictionModel } from "../manage-contradiction-in-branch/file-contradiction.model";

@Component({
  selector: "show-package",
  templateUrl: "./show-package.component.html",
  styleUrls: ["./show-package.component.scss"],
})
export class ShowPackageComponent implements OnInit {
  @Input()
  documentSetModel: FileContradictionModel;
  selectedType: any = { title: "sss", value: "vvv", date: 1653247800000 };
  check: boolean = true;
  public formGroup: FormGroup;
  constructor(
    private persianCalendarService: PersianCalendarService,
    private manageFileService: ManageFileService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getInfo();
  }

  getInfo() {
    this.manageFileService
      .getDocumentById(this.documentSetModel.id)
      .then((res) => {
        this.check = true;
        this.documentSetModel = res;
      })
      .catch(() => {
        this.check = false;
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  setStartDate(event: any) {
    // this.banner.startDate=event
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      var someDate = new Date(sendDate);
      return this.persianCalendarService.PersianCalendarNumeric(someDate);
    }
  }

  getStatus(type: StatusSetTypeEnum) {
    return StatusSetTypeEnum[type];
  }

  getType(type: DocumentSetTypeEnum) {
    return DocumentSetTypeEnum[type];
  }
}
