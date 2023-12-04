import { DocumentSetTypeEnum } from "../manage-document/document-set-type.enum";
import { ConflictModel } from "./conflict.model";

export class DocumentContradictionModel {
  id?: any;
  fromDate?: string;
  toDate?: string;
  type?: DocumentSetTypeEnum;
  conflicts?: ConflictModel[];
  lastState?: any;
  state?: any;
}
