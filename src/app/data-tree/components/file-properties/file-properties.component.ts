import { Component, Input, OnInit } from "@angular/core";
import { FolderModel } from "../../models/folder.model";
import { DocumentModel } from "../../models/Document.model";
import { BookmarkService } from "../../services/bookmark.service";
import { BookmarkModel } from "../../models/bookmark.model";
import { PersianCalendarService } from "../../../shared/services/persian-calendar.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-file-properties",
  templateUrl: "./file-properties.component.html",
  styleUrls: ["./file-properties.component.css"],
})
export class FilePropertiesComponent implements OnInit {
  fileproperties: FolderModel[];

  @Input()
  document: DocumentModel;
  // options: any = [{name: فعال}];
  // selectedOption: any;
  bookMarked = false;
  bookmarkId: string;
  bookmarkList: BookmarkModel[];

  constructor(
    private bookmarkService: BookmarkService,
    private persianCalendarService: PersianCalendarService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllBookmark();
  }

  bookmarkChangedStep() {
    this.bookMarked = !this.bookMarked;

    if (this.bookMarked) {
      this.saveBookmark();
    } else {
      this.deleteBookmark();
    }
  }

  getAllBookmark() {
    this.bookmarkService
      .getAllBookmark()
      .then((res: any) => {
        this.bookmarkList = res;
        this.bookmarkList.forEach((item) => {
          if (this.document.uuid === item.node) {
            this.bookMarked = true;
            this.bookmarkId = item.id;
          }
        });
      })
      .catch((error) => {
        this.toastr.error("خطا در دریافت موارد نشانه گذاری شده", "خطا");
      });
  }

  deleteBookmark() {
    this.bookmarkService
      .deleteBookmark(this.bookmarkId)
      .then((res) => {
        this.toastr.success("نشانه گذاری با موفقیت حذف شد");

        this.getAllBookmark();
      })
      .catch((error) => {
        this.toastr.error("خطا در حذف نشانه گذاری", "خطا");
      });
  }

  saveBookmark() {
    this.bookmarkService
      .saveBookmark(this.document.uuid, this.document.title)
      .then((res: any) => {
        this.bookmarkId = res.id;
        this.toastr.success("نشانه گذاری با موفقیت انجام شد");

        this.getAllBookmark();
      })
      .catch((error) => {
        this.toastr.error("خطا در انجام نشانه گذاری", "خطا");
      });
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      var someDate = new Date(sendDate);
      return this.persianCalendarService.PersianCalendarNumeric(someDate);
    }
  }
}
