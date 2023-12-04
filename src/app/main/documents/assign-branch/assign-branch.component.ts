import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { ProfileDtoModel } from "../../brnaches/manage-document/user.model";
import { BranchService } from "../../service/branch.service";
import { BranchDtoModel } from "./branch.model";

@Component({
  selector: "app-assign-branch",
  templateUrl: "./assign-branch.component.html",
  styleUrls: ["./assign-branch.component.scss"],
})
export class AssignBranchComponent implements OnInit {
  branchContent: BranchDtoModel[];
  branchContentData: BranchDtoModel[];
  branchContentDropDown: BranchDtoModel[];

  //
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl();
  filteredUsers: Observable<string[]>;
  users: string[] = [];
  allUsers: string[] = [];
  userList: ProfileDtoModel[];
  typeKeys: any[] = [];
  userKeys: any[] = [];
  bName;
  bId;
  id: number;
  userId: number;

  isFirstLoad: boolean = true;

  panelOpenState = false;

  //
  ordering: string = "asc";
  resultCount: number = 0;
  page: number = 0;
  //
  searchBody: { profileId?: number; branchId?: number } = {};
  isSearch: boolean = false;

  @ViewChild("userInput", { static: false })
  userInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;
  //

  branchLabel: any = "";
  userLabel: any = "";

  constructor(
    private branchService: BranchService,
    private toastr: ToastrService
  ) {
    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      startWith(null),
      map((user: string | null) =>
        user ? this._filter(user) : this.allUsers.slice()
      )
    );
  }

  ngOnInit() {
    this.userKeys = [];
    this.typeKeys = [];
    this.searchBody = {};
    // this.getAllBranch();
    this.getAllUsers();
    this.branchService
      .getAllBranchesList()
      .then((res: any) => {
        this.branchContentDropDown = res;
        this.branchContentDropDown.forEach((k) => {
          this.typeKeys.push({
            label: k.branchName + "-" + k.branchCode,
            value: k.id,
          });
        });
        this.onPageChange({ first: 0, rows: this.itemsPerPage });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  currentPageItems: any[] = [];
  itemsPerPage = 1500; // Number of items to display per page

  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItems = this.typeKeys.slice(startIndex, endIndex);
  }

  reloadPage() {
    this.searchBody = {};
    this.userKeys = [];
    this.typeKeys = [];
    this.getAllBranch();
    this.branchService
      .getOfficeUsers()
      .then((res) => {
        this.userList = res;
        this.userList.forEach((k) => {
          this.userKeys.push({
            label: k.user.fullName,
            value: k.id,
          });
        });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
    this.branchService
      .getAllBranchesList()
      .then((res: any) => {
        this.branchContentDropDown = res;
        this.branchContentDropDown.forEach((k) => {
          this.typeKeys.push({
            label: k.branchName + "-" + k.branchCode,
            value: k.id,
          });
        });
        this.onPageChange({ first: 0, rows: this.itemsPerPage });
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  getAllBranch() {
    this.isSearch = false;
    this.resultCount = null;
    this.branchService
      .getAllWithSearch(0, 10, "branchName", ",asc", {})
      .then((res: any) => {
        this.branchContent = res.content;
        this.branchContentData = res.content;
        this.resultCount = res.totalElements;
        this.page = res.page;
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  setBranch(event: any) {
    this.searchBody.branchId = event.value.value;
    this.branchLabel = event.value.label;
  }

  setUser(event: any) {
    this.searchBody.profileId = event.value.value;
    this.userLabel = event.value.label;
  }

  loadTable(event: LazyLoadEvent) {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.branchService
        .getAllWithSearch(0, 10, "branchName", ",asc", {})
        .then((res: any) => {
          this.branchContent = res.content;
          this.branchContentData = res.content;
          this.resultCount = res.totalElements;
          this.page = res.page;
        })
        .catch(() => {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
    } else {
      event.sortField === undefined
        ? (event.sortField = "branchName")
        : event.sortField;
      if (event.sortOrder === 1) {
        this.ordering = ",desc";
      } else if (event.sortOrder === -1) {
        this.ordering = ",asc";
      }
      this.branchContent = [];

      if (this.branchContentData) {
        if (this.isSearch) {
          this.branchService
            .getAllWithSearch(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering,
              this.searchBody
            )
            .then((res: any) => {
              this.branchContent = res.content;
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        } else {
          this.branchService
            .getAllWithSearch(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering,
              {}
            )
            .then((res: any) => {
              this.branchContent = res.content;
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        }
      }
    }
  }

  getAllUsers() {
    this.branchService
      .getOfficeUsers()
      .then((res) => {
        this.userList = res;
        this.userList.forEach((k) => {
          this.userKeys.push({
            label: k.user.fullName,
            value: k.id,
          });
        });

        if (this.userList.length > 0) {
          this.userList.forEach((item) =>
            this.allUsers.push(item.user.fullName)
          );
        }
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }
  Search() {
    if (Object.keys(this.searchBody).length !== 0) {
      this.isSearch = true;
      this.resultCount = null;

      this.branchService
        .getAllWithSearch(0, 10, "branchName", ",asc", this.searchBody)
        .then((res: any) => {
          this.branchContent = res.content;
          this.branchContentData = res.content;
          this.page = res.page;
          this.resultCount = res.totalElements;
        })
        .catch(() => {
          if (this.userId === undefined) {
            this.toastr.error("لطفا کاربر مورد نظر را انتخاب کنید", "خطا");
          } else {
            this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
          }
        });
    } else {
      this.isSearch = false;
      this.ngOnInit();
    }
  }

  //
  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add
      if ((value || "").trim()) {
        this.users.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = "";
      }

      this.userCtrl.setValue(null);
    }
  }

  addUser(userLastName: string, item: BranchDtoModel) {
    const userModels = this.userList.filter(
      (user) => user.user.fullName === userLastName
    );
    const assignedFilter = item.assignedProfiles.filter(
      (assignItem) => assignItem.id == userModels[0].id
    );
    if (assignedFilter.length == 0) {
      item.assignedProfiles.push(userModels[0]);
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  remove(userLastName: string, item: BranchDtoModel): void {
    const userModels = this.userList.filter(
      (user) => user.user.fullName === userLastName
    );
    item.assignedProfiles = item.assignedProfiles.filter(
      (assignItem) => assignItem.id != userModels[0].id
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.viewValue);
    this.userInput.nativeElement.value = "";
    this.userCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allUsers.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
    );
  }

  updateBranches() {
    this.branchService.updateBranches(this.branchContent).then((res) => {
      this.toastr.success("تخصیص کاربران با موفقیت انجام شد.");
    });
  }
}
