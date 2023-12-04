import { StateDocumentModel } from "../../brnaches/confirm-package/state-document.model";
import { ConflictModel } from "../../brnaches/manage-contradiction-in-branch/conflict.model";
import { DocumentSetStateEnum } from "../../brnaches/manage-document/document-set-state.enum";
import { DocumentSetTypeEnum } from "../../brnaches/manage-document/document-set-type.enum";

export class ConfirmStateModel {
  id: number;
  fromDate: string;
  toDate: string;
  type: DocumentSetTypeEnum;
  rowsNumber: string;
  registerDate: string;
  sendDate: string;
  currentState: DocumentSetStateEnum;
  state?: StateDocumentModel;
  zipFileId: string;
  haveConflict: boolean;
  branchName: string;
  registrarName: string;
  confirmerName: string;
  documentSetId: number;
  documentUuid: string;
  maintenanceCode: string;
  conflicts: ConflictModel[];
  file?: any;
}
