import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { FileContradictionModel } from "../../brnaches/manage-contradiction-in-branch/file-contradiction.model";
import { ScanService } from "../../service/scan.service";

@Component({
  selector: "app-complete-scan-modal",
  templateUrl: "./complete-scan-modal.component.html",
  styleUrls: ["./complete-scan-modal.component.scss"],
})
export class CompleteScanModalComponent implements OnInit {
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
        .upload(this.fileContradictionSets.id, this.file)
        .subscribe(
          (event: any) => {
            if (typeof event === "object") {
              this.shortLink = event.link;
              this.loading = false;
              if (
                this.fileContradictionSets.type !== "DAILY" &&
                this.fileContradictionSets.type !== "CHAKAVAK"
              ) {
                let request = {
                  ids: [this.fileContradictionSets.id],
                  operation: "confirm",
                };
                this.scanService
                  .acceptDocumentSet(request)
                  .then(() => this.passEntry.emit());
              } else {
                this.passEntry.emit();
              }

              this.toastr.success("بارگذاری فایل با موفقیت انجام شد.");
            }
          },
          (err) => {
            this.loading = false;
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
            this.passEntry.emit();
          }
        );
    }
  }
}
