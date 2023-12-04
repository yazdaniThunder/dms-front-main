import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {
  ManageUserDtoModel,
  ProfileDtoModel,
} from "src/app/main/brnaches/manage-document/user.model";
import { ManageUsersService } from "src/app/main/service/manage-users.service";
import { RoleTypeEnum } from "src/app/shared/components/profile-user-modal/role.model";
import {
  BranchDtoModel,
  BranchTypeEnum,
} from "../../assign-branch/branch.model";

@Component({
  selector: "app-edit-user-modal",
  templateUrl: "./edit-user-modal.component.html",
  styleUrls: ["./edit-user-modal.component.scss"],
})
export class EditUserModalComponent implements OnInit {
  @Input()
  inputModel: ManageUserDtoModel;

  userModel: ProfileDtoModel;

  selectedRole: any;
  selectedBranch: any;
  selectedType: any;

  enumKeys = Object.keys(RoleTypeEnum).map((key) => ({
    label: RoleTypeEnum[key],
    value: key,
  }));

  typeEnumKeys = Object.keys(BranchTypeEnum).map((key) => ({
    label: BranchTypeEnum[key],
    value: key,
  }));

  typeBranchKeys: any[] = [];
  branchContentDropDown: BranchDtoModel[];

  type: string = "";
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public formGroup: FormGroup;

  constructor(
    private toastr: ToastrService,
    private manageUsersService: ManageUsersService
  ) {}

  ngOnInit() {
    this.manageUsersService
      .getProfileById(this.inputModel.profileId)
      .then((res) => {
        this.userModel = res;

        this.selectedRole = {
          label: RoleTypeEnum[this.userModel.role],
          value: this.userModel.role,
        };

        this.selectedType = {
          label: BranchTypeEnum[this.userModel.branchType],
          value: this.userModel.branchType,
        };

        this.type = this.userModel.branchType;

        if (this.type !== null) {
          this.manageUsersService
            .getTypeBranchesList(this.userModel.branchType)
            .then((res: any) => {
              this.branchContentDropDown = res;
              this.branchContentDropDown.forEach((k) => {
                this.typeBranchKeys.push({
                  label: k.branchName + "-" + k.branchCode,
                  value: k.id,
                });
                this.selectedBranch = {
                  label:
                    this.userModel.branchName + "-" + this.userModel.branchCode,
                  value: this.userModel.branchId,
                };
              });
              this.onPageChange({ first: 0, rows: this.itemsPerPage });
            })
            .catch(() => {
              this.toastr.error(
                "مشکل ارتباط با سرور، مجدد تلاش نمایید!",
                "خطا"
              );
            });
        }
      });
  }

  setGeneralType(event: any) {
    this.type = event.value.value;
    this.typeBranchKeys = [];
    this.manageUsersService
      .getTypeBranchesList(event.value.value)
      .then((res: any) => {
        this.branchContentDropDown = res;
        this.branchContentDropDown.forEach((k) => {
          this.typeBranchKeys.push({
            label: k.branchName + "-" + k.branchCode,
            value: k.id,
            parent: k.parentName,
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
    this.userModel.branchId = event.value.value;
    this.userModel.parentName = event.value.parent;
  }

  setRole(event: any) {
    this.userModel.role = event.value.value;
  }

  submit() {
    let request = {
      profileId: this.userModel.id,
      prsnCode: this.userModel.user.prsnCode,
      nationalKey: this.userModel.user.nationalKey,
      personelUserName: this.userModel.user.personelUserName,
      firstName: this.userModel.user.firstName,
      lastName: this.userModel.user.lastName,
      fullName:
        this.userModel.user.firstName + " " + this.userModel.user.lastName,
      role: this.userModel.role,
      branchId: this.userModel.branchId,
    };
    this.manageUsersService
      .updateUser(request)
      .then(() => {
        this.passEntry.emit(true);
        this.toastr.success("تغییرات با موفقیت ثبت شد.");
      })
      .catch(() => {
        this.toastr.error("مشکل ارتباط با سرور مجدد تلاش کنید!", "خطا");
        this.passEntry.emit(false);
      });
  }

  cancel() {
    this.passEntry.emit(false);
  }
}
