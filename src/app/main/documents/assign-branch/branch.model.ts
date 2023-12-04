import { ProfileDtoModel } from "../../brnaches/manage-document/user.model";

export class BranchDtoModel {
  id: number;
  branchAddress: string;
  branchCode: string;
  branchName: string;
  branchType: string;
  cityCode: any;
  cityName: string;
  englishBranchName: string;
  provinceCode: any;
  provinceName: string;
  superVisorCode: any;
  superVisorName: string;
  activeBranch: boolean;
  assignedProfiles: ProfileDtoModel[];
  parentName: string;
}

export enum BranchTypeEnum {
  BRANCH = "شعبه",
  COUNTER = "باجه",
  CORPORATE_BANKING = "بانکداری شرکتی",
}
