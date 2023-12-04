export class OtherFileModel {
  active?: boolean;
  branchCode?: string;
  branchName?: string;
  createByFullName?: string;
  createdById?: string;
  customerNumber?: string;
  fileNumber?: string;
  fileTypeId?: string;
  fileType?: any;
  id?: string;
  lastModifiedById?: string;
  lastModifiedDate?: string;
  lastState?: any;
  otherDocumentFiles?: FileOfOtherModel[];
  registerDate?: string;
  states?: any;
  superVisorCode?: string;
  superVisorName?: string;
}

export class FileOfOtherModel {
  fileStatus: string;
  fileStatusId: string;
  fileUuid: string;
  id: string;
  otherDocumentType: any;
}
export class OtherSearchModel {
  registerFromDate?: string;
  registerToDate?: string;
  customerNumber?: string;
  fileNumber?: string;
  fileTypeId?: number;
  otherDocumentTypeId?: number;
  fileStatusId?: number;
  registrarId?: number;
  branchIds?: number[];
  state?: any;
}
