import { DocumentSetTypeEnum } from "../../brnaches/manage-document/document-set-type.enum";

export class ConflictReasonModel {
  id?: number;
  createdById?: number;
  lastModifiedById?: string;
  registerDate?: string;
  lastModifiedDate?: string;
  active?: boolean;
  documentSetType?: DocumentSetTypeEnum;
  reason?: string;
  type?: any;
}

export class ConflictAddReasonModel {
  id?: number;
  documentSetType?: DocumentSetTypeEnum;
  reason?: string;
  type?: any;
}
