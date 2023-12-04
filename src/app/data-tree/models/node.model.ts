import {CategoriesModel} from './categories.model';
import {ActualVersionModel} from './actual-version.model';

export class NodeModel {
  xsiType:string;
  author:string;
  created:string;
  path:string;
  permissions:number;
  subscribed:boolean;
  uuid:string;
  actualVersion:ActualVersionModel;
  checkedOut:boolean;
  convertibleToPdf:boolean;
  convertibleToSwf:boolean;
  language:string;
  lastModified:string;
  locked:boolean;
  mimeType:string;
  signed:boolean;
  categories:CategoriesModel



}





