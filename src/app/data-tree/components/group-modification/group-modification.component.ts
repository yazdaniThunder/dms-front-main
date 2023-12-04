import { Component, Input, OnInit } from "@angular/core";
import {
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import swal from "sweetalert2";
import { CategoryService } from "../../services/category.service";
import { FolderModel } from "../../models/folder.model";
import { DocumentModel } from "../../models/Document.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-group-modification",
  templateUrl: "./group-modification.component.html",
  styleUrls: ["./group-modification.component.css"],
})
export class GroupModificationComponent implements OnInit {
  even: FolderModel[] = [];

  categoryList: FolderModel[] = [];
  @Input()
  document: DocumentModel;

  selectedCategories: any[] = [];
  private jsonValueChildrenStr: string;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.document.categories) {
      let jsonValueChildrenStr = JSON.stringify(this.document.categories);
      if (jsonValueChildrenStr.includes('[{')) {
        this.selectedCategories = this.document.categories
      } else {
        this.selectedCategories.push(this.document.categories);
      }
    } else {
      this.selectedCategories = [];
    }
    this.fixNodeName(this.selectedCategories);
    this.getAllCategory();
    // this.selectedCategories = [];
    this.mapCatsToListStr();
  }

  getAllCategory() {
    this.categoryService
      .getAllCategory()
      .then((res) => {
        this.jsonValueChildrenStr = JSON.stringify(res);
        if (this.jsonValueChildrenStr.startsWith('{"folder":{')) {
          this.categoryList.push(res.folder);
        } else if (this.jsonValueChildrenStr.includes('[{')) {
          this.categoryList = res.folder;
        }
        this.fixNodeName(this.categoryList);
        this.removeFromBaseList(this.categoryList);
      })
      .catch((error) => {
        this.toastr.error("خطا در دریافت گروه بندی ها", "خطا");
      });
  }

  fixNodeName(catList: any[]) {
    if (catList && catList.length > 0) {
      catList.forEach((item) => {
        const split = item.path.split("/", 10);
        item.name = split[split.length - 1];
      });
    }
  }

  removeFromBaseList(catList: any) {
    if (this.selectedCategories && this.selectedCategories.length > 0) {
      let uuids = this.selectedCategories.map((item) => item.uuid);
      uuids.forEach((uuid) => {
        const itm = this.categoryList.filter((item) => (item.uuid = uuid));
        const index = this.categoryList.indexOf(itm[0], 0);
        if (index > -1) {
          this.categoryList.splice(index, 1);
        }
      });
    }
  }

  mapCatsToListStr() {
    if (this.document.categories && this.document.categories.length > 0) {
      this.document.categories.forEach((doc) => {
        this.selectedCategories.push(doc);
      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  evenPredicate(item: CdkDrag<any>) {
    return item.data.id % 1 === 0;
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return true;
  }

  confirmDoc() {
    swal
      .fire({
        title: "آیا اصلاح گروه را تایید می کنید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        inputPlaceholder: "وارد کنید",
        confirmButtonText: "!بله تایید کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.submitGroup();
          // this.products
        }
      });
  }

  submitGroup() {
    this.selectedCategories.forEach((eve) => {
      this.categoryService
        .saveCategory(this.document.uuid, eve.uuid)
        .then((res) => {})
        .catch((error) => {
          this.toastr.error("خطا در تخصیص گروه", "خطا");
        });
    });
    this.toastr.success("تخصیص گروه با موفقیت انجام شد");
  }

  deleteCategory(catId: string) {
    this.categoryService
      .deleteCategory(this.document.uuid, catId)
      .then((res) => {
        this.toastr.success("دسته بندی با موفقیت حذف شد");
      })
      .catch((error) => {
        this.toastr.error("خطا در حذف دسته بندی", "خطا");
      });
  }
}
