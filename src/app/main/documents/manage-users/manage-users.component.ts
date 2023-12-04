import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { RoleTypeEnum } from "src/app/shared/components/profile-user-modal/role.model";
import {
  ManageUserDtoModel,
  ProfileSearchDtoModel,
} from "../../brnaches/manage-document/user.model";
import { ManageUsersService } from "../../service/manage-users.service";
import { BranchDtoModel } from "../assign-branch/branch.model";

@Component({
  selector: "app-manage-users",
  templateUrl: "./manage-users.component.html",
  styleUrls: ["./manage-users.component.scss"],
})
export class ManageUsersComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  private ngbModalRef: NgbModalRef;
  public formGroup: FormGroup;
  selectedFile: ManageUserDtoModel;
  selectedFiles: ManageUserDtoModel[] = [];
  profileModel: ManageUserDtoModel[];
  profileData: ManageUserDtoModel[];
  panelOpenState = false;
  typeKeys = Object.keys(RoleTypeEnum).map((key) => ({
    label: RoleTypeEnum[key],
    value: key,
  }));
  isSearch: boolean = false;
  resultCount: number = 0;
  ordering: string = ",desc";
  page: number = 0;

  isFirstLoad: boolean = true;

  checked: boolean = true;
  ////////////////////////
  documentSearchDto: ProfileSearchDtoModel = {};
  typeBranchKeys: any[] = [];
  branchContentDropDown: BranchDtoModel[];

  currentPage: number;

  branchLabel: any = "";

  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private manageUsersService: ManageUsersService
  ) {}
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      personCode: new FormControl(""),
      nationalKey: new FormControl(""),
      personelUserName: new FormControl(""),
      fullName: new FormControl(""),
      role: new FormControl(""),
      branchId: new FormControl(""),
    });
    this.manageUsersService
      .getAllBranchesList()
      .then((res: any) => {
        this.branchContentDropDown = res;
        this.branchContentDropDown.forEach((k) => {
          this.typeBranchKeys.push({
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
    this.currentPageItems = this.typeBranchKeys.slice(startIndex, endIndex);
  }

  setBranch(event: any) {
    this.documentSearchDto.branchId = event.value.value;
    this.branchLabel = event.value.label;
  }

  setRole(event: any) {
    if (event.value === "ALL") {
      this.documentSearchDto.role = null;
    } else {
      this.documentSearchDto.role = event.value;
    }
  }

  getRole(type: RoleTypeEnum) {
    return RoleTypeEnum[type];
  }

  search() {
    if (Object.keys(this.documentSearchDto).length !== 0) {
      this.isSearch = true;
      this.resultCount = null;
      this.manageUsersService
        .getAllUsersWithSearch(0, 10, "id", ",desc", this.documentSearchDto)
        .then((res: any) => {
          this.profileData = res.content;
          this.profileModel = res.content;
          this.page = res.page;
          this.resultCount = res.totalElements;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      this.isSearch = false;
      this.ngOnInit();
      this.getAllUsersData();
    }
  }

  resetSearchItems() {
    this.formGroup.reset();
    this.documentSearchDto = {};
  }

  openModalFileClick(content, selectedFile?: ManageUserDtoModel) {
    this.selectedFile = selectedFile;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.passEntry.emit();
    });
  }

  submitNew(event?: any) {
    this.ngbModalRef.close();
    if (event && event != false) {
      this.loadAllUsers({ first: this.currentPage * 10, rows: 10 });
    }
  }

  handleChange(activate, id) {
    this.manageUsersService.activate(id, !!activate).then(() => {
      this.loadAllUsers({ first: this.currentPage * 10, rows: 10 });
    });
  }

  getAllUsersData() {
    this.isSearch = false;
    this.resultCount = null;
    this.manageUsersService
      .getAllUsersWithSearch(0, 10, "id", ",desc", {})
      .then((res: any) => {
        this.profileData = res.content;
        this.profileModel = res.content;
        this.resultCount = res.totalElements;
        this.page = res.page;
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  loadAllUsers(event: LazyLoadEvent) {
    this.currentPage = event.first / 10;

    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.manageUsersService
        .getAllUsersWithSearch(0, 10, "id", ",desc", {})
        .then((res: any) => {
          this.profileData = res.content;
          this.profileModel = res.content;
          this.resultCount = res.totalElements;
          this.page = res.page;
        })
        .catch(() =>
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
        );
    } else {
      event.sortField === undefined
        ? (event.sortField = "id")
        : event.sortField;
      if (event.sortOrder === 1) {
        this.ordering = ",desc";
      } else if (event.sortOrder === -1) {
        this.ordering = ",asc";
      }
      this.profileData = [];

      if (this.profileModel) {
        if (this.isSearch) {
          this.manageUsersService
            .getAllUsersWithSearch(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering,
              this.documentSearchDto
            )
            .then((res: any) => {
              this.profileData = res.content;
              this.resultCount = res.totalElements;
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        } else {
          this.manageUsersService
            .getAllUsersWithSearch(
              event.first / 10,
              event.rows,
              event.sortField,
              this.ordering,
              {}
            )
            .then((res: any) => {
              this.profileData = res.content;
              this.resultCount = res.totalElements;
            })
            .catch(() => {
              this.toastr.error(
                "مشکل ارتباط با سرور، مجدد تلاش نمایید!",
                "خطا"
              );
            });
        }
      }
    }
  }
}
