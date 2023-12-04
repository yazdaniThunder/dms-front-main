import { ConflictReasonsModel } from "./conflict-reasons.model";

export class SetConflictModel {
        description?: any;
        registerDescription?: any;
        resolveDescription?: string;
        documentSetId?: number;
        conflictReasons?: ConflictReasonsModel[];
  }
  

export class SetAllConflictModel {
    description?: any;
    registerDescription?: any;
    resolveDescription?: string;
    documentSetIds?: number[];
    conflictReasons?: ConflictReasonsModel[];
  }
  