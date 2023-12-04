import { BranchDtoModel } from "../../documents/assign-branch/branch.model";
import { DocumentSetTypeEnum } from "./document-set-type.enum";

export class DocumentSetModel {
  fileStatusId?: any;
  filename?: string;
  documentNumber?: string;
  documentDate?: string;
  maintenanceCode?: string;
  id?: any;
  createByFullName?: string;
  createdById?: number;
  lastModifiedById?: number;
  registerDate?: string;
  lastModifiedDate?: string;
  active?: boolean;
  fromDate?: string;
  toDate?: string;
  type?: any;
  rowsNumber?: string;
  sequence?: string;
  sendDate?: string;
  registrarName?: string;
  confirmerName?: string;
  ocr?: boolean;
  haveConflict?: boolean;
  description?: string;
  branch?: BranchDtoModel;
  state?: StateDtoModel;
  currentState?: string;
  documentSize?: number;
  documents?: any;
  conflicts?: ConflictDocDtoModel;
  status?: [] | any;
  states?: [] | any;
  registerFromDate?: string;
  registerToDate?: string;
  sentFromDate?: string;
  sentToDate?: string;
  scannerId?: number;
  registrarId?: number;
  confirmerId?: number;
  branchId?: string;
  branchIds?: [] | any;
  documentNotCheckedSize?: string;
  rowNumber?: string;
  conflictRegisterDate?: string;
  reason?: any;
  lastState?: any;
  fileNumber?: string;
  customerNumber?: string;
  fileTypeId?: number;
  otherDocumentTypeId?: number;
}

export class StateDtoModel {
  id: number;
  createByFullName: string;
  createdById: number;
  lastModifiedById: number;
  registerDate: string;
  lastModifiedDate: string;
  active: boolean;
  username: string;
  name: string;
  description: string;
  seen: boolean;
}

export class ConflictDocDtoModel {
  id: number;
  createByFullName: string;
  createdById: number;
  lastModifiedById: number;
  registerDate: string;
  lastModifiedDate: string;
  active: boolean;
  resolvingDate: string;
  registrarName: string;
  resolverId: number;
  resolverName: string;
  registerDescription: string;
  resolveDescription: string;
  documentSetId: number;
  conflictReasons: ConflictReasonsDto[];
}

export class ConflictReasonsDto {
  id: number;
  createByFullName: string;
  createdById: number;
  lastModifiedById: number;
  registerDate: string;
  lastModifiedDate: string;
  active: boolean;
  reason: string;
  type: string;
  documentSetType: DocumentSetTypeEnum;
}
