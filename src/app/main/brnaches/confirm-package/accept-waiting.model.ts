import { DocumentSetTypeEnum } from "../manage-document/document-set-type.enum";
import { StateDocumentModel } from "./state-document.model";

export class AcceptWaitingModel {
  id?: number;
  fromDate?: string;
  toDate?: string;
  type?: DocumentSetTypeEnum;
  branchName?: string;
  state?: StateDocumentModel[];
}
