import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ProfileDtoModel } from "src/app/main/brnaches/manage-document/user.model";
import { AuthService } from "../../services/auth.service";
import { ManageDocumentService } from "./profile.service";
import { RoleTypeEnum } from "./role.model";

@Component({
  selector: "app-profile-user-modal",
  templateUrl: "./profile-user-modal.component.html",
  styleUrls: ["./profile-user-modal.component.scss"],
})
export class ProfileUserModalComponent implements OnInit {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  profileModel: ProfileDtoModel = {};
  loading: boolean = false;
  badges: any;
  roleName: any;

  constructor(
    private manageDocumentService: ManageDocumentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.roleName = localStorage.getItem("roleName");

    this.getData();
    if (this.roleName === "BA" || this.roleName === "BU") {
      this.getBadge();
    }
  }

  getData() {
    this.loading = true;
    this.manageDocumentService
      .getProfilebyId(localStorage.getItem("profileId"))
      .then((res) => {
        this.profileModel = res;
        this.loading = false;
      })
      .catch((err) => console.error(err));
  }

  getType(type: RoleTypeEnum) {
    return RoleTypeEnum[type];
  }

  getBadge() {
    this.loading = true;

    this.authService
      .getBadge()
      .then((res: any) => {
        this.badges = res;
        localStorage.setItem("totalCount", res.totalCount);
        this.loading = false;
      })
      .catch((err) => console.error(err));
  }
}
