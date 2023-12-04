export class UserModel {
  id?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  password?: string;
  roles?: any;
}

export class UserDtoModel {
  id: any;
  cfCiNo: string;
  personelUserName: string;
  completeName: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  fullName: string;
  nationalKey: string;
  isIntActiveCode: boolean;
  isIntActiveDesc: boolean;
  password?: string;
  prsnCode?: string;
  personCode?: string;
}
export class ProfileDtoModel {
  id?: any;
  prAcBranch?: any;
  aBranchName?: string;
  aBranchCode?: any;
  position?: string;
  job?: string;
  rankingPositionDesc?: string;
  rankingJobDesc?: string;
  rankingPositionCode?: any;
  positionCode?: string;
  parentBranch?: string;
  user?: UserDtoModel;
  branchId?: any;
  role?: any;
  active?: boolean;
  branchName?: string;
  branchCode?: string;
  branchType?: string;
  parentName?: string;
  personCode?: string;
}

export class ProfileSearchDtoModel {
  personCode?: string;
  nationalKey?: string;
  personelUserName?: string;
  fullName?: string;
  role?: any;
  job?: string;
  branchId?: any;
}

export class ManageUserDtoModel {
  profileId?: string;
  userId?: string;
  personCode?: string;
  nationalKey?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  branchCode?: string;
  branchName?: string;
  type?: any;
  role?: any;
  personelUserName?: string;
  branchType?: string;
  branchId?: string;
  parentName?: string;
}
