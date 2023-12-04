import { ConflictModel } from "./conflict.model";
import { DocumentModel } from "./document.model";
import { StatusSetTypeEnum } from "./status-set-type.enum";

export class FileContradictionModel {
  id?: any;
  branch?: any;
  documentSetId?: number;
  documentUuid?: string;
  maintenanceCode?: string;
  branchCode?: string;
  branchName?: string;
  documentSetRowsNumber?: string;
  primaryApproverId?: string;
  finalApproverId?: string;
  status?: StatusSetTypeEnum;
  conflicts?: ConflictModel[];
  haveConflict?: boolean;
  document?: DocumentModel;
  file?: DocumentModel;
  documents?: DocumentModel[];
  errorCode?: string;
  fromDate?: any;
  toDate?: any;
  sendDate?: any;
  name?: string;
  currentState?: string;
  registerFromDate?: string;
  registerToDate?: string;
  sentFromDate?: string;
  sentToDate?: string;
  type?: any;
  registrarId?: string;
  expiryDate?: any;
  receiveDescription?: any;
  confirmerId?: string;
  state?: any;
  states?: [] | any;
  fileUuid?: string;
  branchFileUuid?: string;
  branchIds?: [] | any;
  officeFiles?: any;
  lastState?: any;
  scannerId?: number;
  documentDate?: string;
  documentNumber?: string;
  rowNumber?: string;
  requestType?: any;
  fileNumber?: string;
  customerNumber?: string;
  fileTypeId?: number;
  otherDocumentTypeId?: number;
  fileStatusId?: any;
  fileStatusTitle?: string;
}
