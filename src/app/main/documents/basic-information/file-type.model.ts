export class FileTypeModel {
  id?: number;
  title?: string;
  fileStatuses?: IdTitleModel[];
  otherDocumentTypes?: IdTitleModel[];
  activateFileNumber?: boolean;
}

export class IdTitleModel {
  id?: number;
  title?: string;
  isDefault?: boolean;
  // basic?: boolean;
  fileType?: string;
}
