import {
  GeneralRegularUpdateOperation,
  UpdateOperand,
  UpdateOperationOrSetOperand,
  UpdateOperator,
} from "./update-operation";

import { DocumentPath } from "../common/document-path";
import { normalizeUpdateOperation } from "./normalize-update-operation";

/**
 * Retarget the given UpdateOperation to the given docPath.
 */
export function retargetOperation(
  docPath: DocumentPath,
  _operation: UpdateOperationOrSetOperand
): GeneralRegularUpdateOperation {
  const operation = normalizeUpdateOperation(_operation);
  const newOperation: GeneralRegularUpdateOperation = {};

  Object.entries(operation).forEach(
    // @ts-ignore operator is UpdateOperator
    <OP extends UpdateOperator>([operator, operand]: [
      OP,
      UpdateOperand<OP>
    ]) => {
      const newOperand: UpdateOperand<OP> = {};
      Object.entries(operand).forEach(([originalDocPath, value]) => {
        const newDocPath = [docPath, originalDocPath].join("."); // FIXME (use regualar method to merge paths.)
        newOperand[newDocPath] = value;
      });
      newOperation[operator] = newOperand;
    }
  );
  return newOperation;
}

export function retargetAndRestore(
  docPath: DocumentPath,
  _operation: UpdateOperationOrSetOperand
): GeneralRegularUpdateOperation {
  const operation = retargetOperation(docPath, _operation);

  const $restore = operation.$restore || {};
  $restore[docPath] = "";

  return Object.assign({}, operation, { $restore });
}
