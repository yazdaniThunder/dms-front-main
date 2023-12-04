import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { TreeService } from "../../services/tree.service";
import { FolderModel } from "../../models/folder.model";
import { DocumentModel } from "../../models/Document.model";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ISubscription } from "rxjs-compat/Subscription";
import swal from "sweetalert2";
import { DocumentService } from "../../services/document.service";
import { ToastrService } from "ngx-toastr";
import { PersianCalendarService } from "../../../shared/services/persian-calendar.service";

@Component({
  selector: "app-tree-directory",
  templateUrl: "./tree-directory.component.html",
  styleUrls: ["./tree-directory.component.css"],
})
export class TreeDirectoryComponent implements OnInit, OnDestroy {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  childrenList: FolderModel[];
  childrenDocList: DocumentModel[] = [];
  selectedDocInForm: DocumentModel[] = [];
  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  uuId: string;
  selectedDoc: DocumentModel;
  techForm: FormGroup;
  techFormDetails: FormGroup;
  private unsubscribeDetails: ISubscription;
  private unsubscribe: ISubscription;
  showTypes: any = [
    { id: 1, name: "عادی" },
    { id: 2, name: "جزییات" },
  ];
  showType: any = { id: 1, name: "عادی" };
  path = "";
  public isSelected: boolean;
  public isSelectedForCopy: boolean = false;
  public succsess: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private treeService: TreeService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private persianCalendarService: PersianCalendarService,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    const item = localStorage.getItem("selectedUuid");
    if (item && item.length > 0) {
      this.isSelectedForCopy = true;
    }
    this.route.params.subscribe((params) => {
      if (params.uuid == "undefined") {
        this.uuId = null;
      } else {
        this.uuId = params.uuid;
      }
      this.getPath();

      this.callApiDocNoFolder(this.uuId);
    });
    this.techForm = this.formBuilder.group({
      selectedTech: "",
    });
    this.unsubscribe = this.techForm.valueChanges.subscribe((value) => {
      this.selectedDocInForm = value.selectedTech;
    });

    this.techFormDetails = this.formBuilder.group({
      checkBox: "",
    });
    // this.unsubscribeDetails = this.techFormDetails.valueChanges.subscribe(value => {
    //   this.selectedDocInForm = value.checkBox;
    // });
  }

  // getImage(url: any) {
  //   const corsImageModified = new Image();
  //   corsImageModified.crossOrigin = "no-cors";
  //   corsImageModified.src = url
  //   // corsImageModified.src = url + "?not-from-cache-please";
  //   return corsImageModified;
  // }

  callApiDocNoFolder(uuId: string) {
    this.childrenDocList = [];
    if (uuId !== "null") {
      this.treeService
        .callApiDocNoFolder(uuId)
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
            if (resposeStr.startsWith("[{")) {
              this.childrenDocList = JSON.parse(JSON.stringify(res));
            } else if (JSON.stringify(res).startsWith("{")) {
              this.childrenDocList.push(JSON.parse(JSON.stringify(res)));
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
          // }
        })
        .catch((error) => {
          // this.handleError(error);
        });
    }
  }

  handleError(error: HttpErrorResponse) {
    alert(
      "خطا" +
        " " +
        error.status +
        " " +
        "مشکل ارتباط با سرور مجدد تلاش نمایید !"
    );
  }

  submitNew() {
    this.ngbModalRef.close();
  }

  openModalClick(content, item: DocumentModel) {
    this.selectedDoc = item;
    this.ngbModalRef = this.modalService.open(content, {
      windowClass: "my-class",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }

  uploadFileModal(content) {
    this.ngbModalRef = this.modalService.open(content, {
      windowClass: "my-class",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  checkFileIcon(title: string, showTypeId: number) {
    if (title.substr(title.length - 4) === "docx") {
      return "../../../../assets/icons/word-file.svg";
    } else if (title.substr(title.length - 4) === "xlsx") {
      return "../../../../assets/icons/excel-file.svg";
    } else if (title.substr(title.length - 3) === "pdf") {
      return "../../../../assets/icons/pdf-file.svg";
    } else if (
      title.substr(title.length - 3) === "PNG" ||
      title.substr(title.length - 3) === "jpg" ||
      title.substr(title.length - 3) === "png" ||
      title.substr(title.length - 4) === "jpeg"
    ) {
      return "../../../../assets/icons/image-file.svg";
    } else {
      return "../../../../assets/icons/default-file.svg";
    }
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
          if (result.isConfirmed) {
            this.selectedDocInForm.forEach((item) => {
              this.documentService.deleteDoc(item.uuid).then((res) => {
                if (result.value) {
                  const index = this.childrenDocList.indexOf(item, 0);
                  if (index > -1) {
                    this.childrenDocList.splice(index, 1);
                  }
                }
                this.succsess = true;
                this.callApiDocNoFolder(this.uuId);
              });
            });
          }
          if (this.succsess) {
            this.toastr.success("حذف فایل ها با موفقیت انجام شد");

            this.callApiDocNoFolder(this.uuId);
            this.succsess = false;
          }
        })
        .catch((error) => {
          this.toastr.error("خطا در حذف فایلها ", "خطا");
        });
    }
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe.unsubscribe();
    }
  }

  changeSelection() {
    this.fetchSelectedItems();
  }

  fetchSelectedItems() {
    this.selectedDocInForm = this.childrenDocList.filter((value, index) => {
      return value.isChecked;
    });
  }

  getUploadedDoc(event: DocumentModel) {
    const split = event.path.split("/", 10);
    event.title = split[split.length - 1];
    this.childrenDocList.push(event);
    this.modalService.dismissAll();
  }

  copyDoc(isCopied: boolean) {
    if (this.selectedDocInForm && this.selectedDocInForm.length > 0) {
      let docsCopied: any[] = [];
      localStorage.setItem("isCopied", String(isCopied));

      this.selectedDocInForm.forEach((item) => {
        docsCopied.push(item);
      });
      localStorage.setItem("selectedUuid", JSON.stringify(docsCopied));
      if (localStorage.getItem("selectedUuid").length > 0 && isCopied === true) {
        this.toastr.success("کپی فایل ها با موفقیت انجام شد");
      } else if (
        localStorage.getItem("selectedUuid").length > 0 &&
        isCopied === false
      ) {
        this.toastr.success("ذخیره فایل های انتقالی  با موفقیت انجام شد");
      } else {
        this.toastr.error("خطا در سرویس ", "خطا");
      }
      this.childrenDocList.forEach((item) => {
      });
    }
  }

  pasteDoc() {
    const selectedUuid = localStorage.getItem("selectedUuid");
    const isCopy = localStorage.getItem("isCopied");
    let selectedObj = <any[]>JSON.parse(selectedUuid);

    if (isCopy === "true" && selectedUuid != null) {
      swal
        .fire({
          title: "آیا از کپی فایل های انتخاب شده اطمینان دارید؟",
          showCancelButton: true,
          confirmButtonColor: "#820263",
          cancelButtonColor: "#625e61",
          cancelButtonText: "انصراف",
          confirmButtonText: "!بله کپی کن",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            selectedObj.forEach((item) => {
              this.documentService
                .copyDoc(item.uuid, this.uuId, item.title)
                .then((res: any) => {
                  this.callApiDocNoFolder(this.uuId);
                  this.isSelectedForCopy = false;
                });
            });
            this.toastr.success("عملیات پیست فایل ها با موفقیت انجام شد");
          }
        });
    } else if ( selectedUuid != null) {
      swal
        .fire({
          title: "آیا از انتقال فایل های انتخاب شده اطمینان دارید؟",
          showCancelButton: true,
          confirmButtonColor: "#820263",
          cancelButtonColor: "#625e61",
          cancelButtonText: "انصراف",
          confirmButtonText: "!بله انتقال بده",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            selectedObj.forEach((item) => {
              this.documentService.moveDoc(item.uuid, this.uuId).then((r) => {
                this.callApiDocNoFolder(this.uuId);
              });
            });
            this.toastr.success("عملیات پیست فایل ها با موفقیت انجام شد");
          }
          this.callApiDocNoFolder(this.uuId);
        });
    }

    localStorage.removeItem("isCopied");
    localStorage.removeItem("selectedUuid");
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

  private getPath() {
    this.treeService.getPath(this.uuId).then((res) => {
      this.path = res;
      const split = this.path.split('/', 10);
    });
  }

  closeModal() {
    this.callApiDocNoFolder(this.uuId);
    this.modalService.dismissAll();
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
