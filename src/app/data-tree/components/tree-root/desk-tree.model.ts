
export class DeskTreeModel {
  key?: string;
  parentId?: string;
  label?: string;
  data?: string;
  deskId?: string;
  createDate?: number;
  indexId?: number;
  children?: DeskTreeModel[];
  treeItemType?: number;
}

export enum TreeItemType {
  unEditable,
  editable
}

