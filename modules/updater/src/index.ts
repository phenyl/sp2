export {
  update,
  updateAndRestore,
  updateProp,
  updatePropAndRestore,
} from "./updater";

export {
  $update,
  DocumentPath,
  GeneralRegularUpdateOperation,
  GeneralUpdateOperation,
  RegularUpdateOperand,
  RegularUpdateOperation,
  RenameOperand,
  RestoreOperand,
  UpdateOperand,
  UpdateOperation,
  UpdateOperationOrSetOperand,
  UpdateOperator,
  allUpdateOperators,
  createDocumentPath,
  getNestedValue,
  mergeUpdateOperations,
  parseDocumentPath,
  retargetAndRestore,
  retargetOperation,
} from "@sp2/format";
