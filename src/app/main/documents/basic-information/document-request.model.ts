export class DocumentReasonModel {
  id?: number;
  createdById?: number;
  lastModifiedById?: string;
  registerDate?: string;
  lastModifiedDate?: string;
  active?: boolean;
  title?: string;
  requestReasonValidations?: RequestReasonValidationsModel[];
}

export class RequestReasonValidationsModel {
  id?: number;
  fieldName?: string;
  required?: boolean;
}