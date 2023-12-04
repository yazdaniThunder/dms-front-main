import { ConflictReasonsModel } from "./conflict-reasons.model";

export class ConflictModel {
  id?: number;
  documentSetId?: number;
  registerDate?: string;
  conflictReasons?: ConflictReasonsModel[];
  conflicts?: any;
  registerDescription?: string;
  resolveDescription?: string;
  registrarName?: string;
}
