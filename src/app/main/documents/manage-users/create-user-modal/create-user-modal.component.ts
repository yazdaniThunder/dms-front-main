import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DocumentSetModel } from "src/app/main/brnaches/manage-document/document-set.model";
import { ManageUsersService } from "src/app/main/service/manage-users.service";
import { RoleTypeEnum } from "src/app/shared/components/profile-user-modal/role.model";
import {
  BranchDtoModel,
  BranchTypeEnum,
} from "../../assign-branch/branch.model";
import { CreateUserModel } from "./createUser.model";

@Component({
  selector: "app-create-user-modal",
  templateUrl: "./create-user-modal.component.html",
  styleUrls: ["./create-user-modal.component.scss"],
})
export class CreateUserModalComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public formGroup: FormGroup;
  public documentSetModel: DocumentSetModel = {};
  type: string = "";

  parentName: string = "";

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

  branchLabel: any = "";
  roleLabel: any = "";
  typeLabel: any = "";

  public createUserModel: CreateUserModel = {};

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private manageUsersService: ManageUsersService
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      role: new FormControl("", [Validators.required]),
      branchId: new FormControl("", [Validators.required]),
      personelUserName: new FormControl("", [Validators.required]),
      nationalKey: new FormControl("", [Validators.required]),
      prsnCode: new FormControl("", [Validators.required]),
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
    this.createUserModel.branchId = event.value.value;
    this.parentName = event.value.parent;
    this.branchLabel = event.value.label;
  }

  setRole(event: any) {
    this.createUserModel.role = event.value.value;
    this.roleLabel = event.value.label;
  }

  setGeneralType(event: any) {
    this.type = event.value.value;
    this.typeLabel = event.value.label;
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

  submit() {
    this.createUserModel.fullName =
      this.createUserModel.firstName + " " + this.createUserModel.lastName;
    this.manageUsersService
      .createUser(this.createUserModel)
      .then(() => {
        this.passEntry.emit(true);
        this.toastr.success("ایجاد کاربر با موفقیت انجام شد.");
      })
      .catch((err) => {
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
      });
  }

  cancel() {
    this.passEntry.emit(false);
  }

  setType(event: any) {
    this.documentSetModel.type = event.value.value;
  }

  checkValidations() {
    this.clearAllValidators();
    this.formGroup.controls["type"].setValidators([Validators.required]);

    this.formGroup.controls["type"].updateValueAndValidity();
  }

  clearAllValidators() {
    this.formGroup.controls["type"].clearValidators();

    this.formGroup.controls["type"].updateValueAndValidity();
  }
}
