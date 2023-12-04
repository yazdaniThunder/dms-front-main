import {DocumentSetTypeEnum} from './document-set-type.enum';

export class DocumentExcelModel {
  id?: number;
  fromDate?: string;
  toDate?: string;
  type?: DocumentSetTypeEnum;
}
