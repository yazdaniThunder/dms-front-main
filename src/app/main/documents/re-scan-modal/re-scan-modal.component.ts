import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { FileContradictionModel } from "../../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { ScanService } from "../../service/scan.service";

@Component({
  selector: "app-re-scan-modal",
  templateUrl: "./re-scan-modal.component.html",
  styleUrls: ["./re-scan-modal.component.scss"],
})
export class ReScanModalComponent implements OnInit {
  @Input()
  fileContradictionSets: FileContradictionModel;
  shortLink: string = "";
  loading: boolean = false;
  file: File = null;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  constructor(
    private scanService: ScanService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  onChange(event) {
    this.file = event.target.files[0];
  }

  onUpload() {
    if (this.file === null) {
      this.toastr.info("لطفا فایل را انتخاب کنید.");
    } else {
      this.loading = !this.loading;
      this.scanService
        .reUpload(this.fileContradictionSets.id, this.file)
        .subscribe(
          (event: any) => {
            this.loading = false;
            this.toastr.success("بارگذاری فایل با موفقیت انجام شد.");
            this.passEntry.emit();
            if (typeof event === "object") {
              this.shortLink = event.link;
            }
          },

          (err) => {
            if (err.status === 400) {
              this.loading = false;
              this.toastr.error("فایل بارگذاری شده مشکل دارد", "خطا");
              this.passEntry.emit();
            } else {
              this.loading = false;
              this.toastr.error(
                "مشکل ارتباط با سرور، مجدد تلاش نمایید!",
                "خطا"
              );
              this.passEntry.emit();
            }
          }
        );
    }
  }
}
