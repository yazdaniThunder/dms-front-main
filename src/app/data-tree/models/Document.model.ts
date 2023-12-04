import { ActualVersionModel } from "./actual-version.model";

export class DocumentModel {
  author?: string;
  created?: string;
  path?: string;
  permissions?: number;
  subscribed?: boolean;
  uuid?: string;
  categories?: any;
  notes?: any;
  actualVersion?: ActualVersionModel;
  checkedOut?: boolean;
  convertibleToPdf?: boolean;
  convertibleToSwf?: boolean;
  lastModified?: any;
  locked?: boolean;
  mimeType?: string;
  signed?: boolean;
  title?: string;
  name?: string;
  type?: any;
  isChecked?: boolean;
  thumbnailLink?: string;
  imageToShow?: any;
  documentSetRowsNumber?: number;
  currentState?: any;
  id?: number;
  textExtracted?: boolean;
}
