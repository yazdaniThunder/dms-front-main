import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SearchResponseModel } from "../../models/search-response.model";
import { DocumentModel } from "../../models/Document.model";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ISubscription } from "rxjs-compat/Subscription";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import swal from "sweetalert2";
import { BookmarkService } from "../../services/bookmark.service";
import { BookmarkModel } from "../../models/bookmark.model";
import { DocumentService } from "../../services/document.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-bookmark-directory",
  templateUrl: "./bookmark-directory.component.html",
  styleUrls: ["./bookmark-directory.component.css"],
})
export class BookmarkDirectoryComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  searchedResponse: SearchResponseModel[];
  searchTitle: string;
  childrenDocList: DocumentModel[] = [];
  techForm: FormGroup;
  public formGroup: FormGroup;
  private unsubscribe: ISubscription;
  selectedDocInForm: DocumentModel[] | any;
  showTypes: any = [
    { id: 1, name: "عادی" },
    { id: 2, name: "جزییات" },
  ];
  showType: any = { id: 1, name: "عادی" };
  private ngbModalRef: NgbModalRef;
  selectedDoc: DocumentModel;
  searchFromDate: string;
  searchToDate: string;
  bookmarkList: BookmarkModel[] = [];
  public isSelected: boolean;

  constructor(
    private documentService: DocumentService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private bookmarkService: BookmarkService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.techForm = this.formBuilder.group({
      selectedTech: "",
      checkBox: "",
    });
    this.unsubscribe = this.techForm.valueChanges.subscribe((value) => {
      this.selectedDocInForm = value.selectedTech;
    });
    this.getAllBookmark();
  }

  getAllBookmark() {
    this.bookmarkService
      .getAllBookmark()
      .then((res: any) => {
        this.bookmarkList = res;
      })
      .catch((error) => {
        this.toastr.error("خطا در دریافت موارد نشانه گذاری شده", "خطا");
      });
  }

  openModalClick(content, item: any) {
    // this.getDoc(item.uuid);

    this.selectedDoc = item;
    this.selectedDoc.uuid = item.node;
    this.ngbModalRef = this.modalService.open(content, {
      windowClass: "my-class",
    });
    this.ngbModalRef.result.then((result) => {
      this.documentService.getDocContent(item.uuid);
      this.passEntry.emit();
    });
  }

  getDoc(uuid: string) {
    this.documentService
      .getDoc(uuid)
      .then((res) => {
        const resposeStr = JSON.stringify(res);
        if (
          resposeStr != null ||
          resposeStr === "{}" ||
          resposeStr !== "" ||
          resposeStr !== undefined
        ) {
          if (resposeStr.startsWith("{}")) {
            return;
          }
          if (resposeStr.startsWith('{"document":[{')) {
            this.childrenDocList = JSON.parse(JSON.stringify(res)).document;
          } else if (JSON.stringify(res).startsWith("{")) {
            this.childrenDocList.push(JSON.parse(JSON.stringify(res)).document);
          }
          if (
            this.childrenDocList !== undefined &&
            this.childrenDocList.length > 0
          ) {
            this.childrenDocList.forEach((child) => {
              const split = child.path.split("/", 10);
              child.title = split[split.length - 1];
              child.isChecked = false;

              const index = split.indexOf(child.title, 0);
              if (index > -1) {
                split.splice(index, 1);
              }
            });
          }
        }
      })
      .catch((error) => {
        // this.handleError(error);
      });
  }

  checkFileIcon(title: string, showTypeId: number) {
    if (title.substr(title.length - 4) === "docx") {
      return showTypeId === 1
        ? "word-big fa fa-file-word-o"
        : "fa word-small  fa-file-word-o";
    } else if (title.substr(title.length - 4) === "xlsx") {
      return showTypeId === 1
        ? "excel-big fa fa-file-excel-o"
        : "fa excel-small fa-file-excel-o";
    } else if (title.substr(title.length - 3) === "pdf") {
      return showTypeId === 1
        ? "pdf-big fa fa-file-pdf-o"
        : "fa pdf-small fa-file-pdf-o";
    } else if (
      title.substr(title.length - 3) === "PNG" ||
      title.substr(title.length - 3) === "jpg"
    ) {
      return showTypeId === 1
        ? "image-big fa fa-file-image-o"
        : "fa image-small fa-file-image-o";
    } else if (title.substr(title.length - 3) === "txt") {
      return showTypeId === 1
        ? "txt-big fa fa-file-text-o"
        : "fa txt-small fa-file-text-o";
    } else {
      return showTypeId === 1 ? "file-big fa fa-file" : "fa file-small fa-file";
    }
  }
  changeSelection() {
    this.fetchSelectedItems();
  }

  fetchSelectedItems() {
    this.selectedDocInForm = this.bookmarkList.filter((value, index) => {
      return value.isChecked;
    });
  }

  deleteFiles() {
    if (this.selectedDocInForm && this.selectedDocInForm.length > 0) {
      swal
        .fire({
          title: "آیا از حذف فایل های انتخاب شده اطمینان دارید؟",
          text: "!شما قادر به برگرداندن موارد حذف شده نخواهید بود",
          showCancelButton: true,
          confirmButtonColor: "#820263",
          cancelButtonColor: "#625e61",
          cancelButtonText: "انصراف",
          confirmButtonText: "!بله حذف کن",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.value) {
            this.selectedDocInForm.forEach((item) => {
              this.bookmarkService.deleteBookmark(item.id).then(res => {
                this.getAllBookmark();
              });
            });
            this.toastr.success("فایل های نسانه گذاری شده با موفقیت حذف شد");
          }
        })
        .catch((error) => {
          this.toastr.error("خطا در حذف فایل ها", "خطا");
        });
    }
  }

  onSelectItem() {
    this.isSelected = this.selectedDocInForm.length > 0;
  }

  onSelectItemInDetail(event: any, item: DocumentModel) {
    const index = this.selectedDocInForm.indexOf(item, 0);
    if (index > -1) {
      this.selectedDocInForm.splice(index, 1);
    } else {
      this.selectedDocInForm.push(item);
    }

    this.isSelected = this.selectedDocInForm.length > 0;
  }

}
