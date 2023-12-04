import {ActualVersionModel} from './actual-version.model';
import {CategoriesModel} from './categories.model';
import {NoteModel} from './note.model';
import {DocumentModel} from './Document.model';


export class SearchResponseModel {
  attachment?: boolean;
  excerpt?: string;
  node?: DocumentModel;
  score?: number;
  subscribed?: boolean;
  uuid?: string;
  categories?: CategoriesModel[];
  notes?: NoteModel;
  actualVersion?: ActualVersionModel;
  checkedOut?: boolean;
  convertibleToPdf?: boolean;
  convertibleToSwf?: boolean;
  lastModified?: string;
  locked?: boolean;
  mimeType?: string;
  signed?: boolean;
  title?: string;
  type = 'jjj';
  isChecked?: boolean;

}
