import { GeneralUpdateOperation, UpdateOperand } from "./update-operation";

import { convertToDotNotationString } from "../common/document-path";
import { visitUpdateOperation } from "./visit-update-operation";

export function toMongoUpdateOperation(
  updateOperation: GeneralUpdateOperation
): GeneralUpdateOperation {
  // The order is important. convertRenameOperand must be put after convertDocumentPathFormat
  return [convertDocumentPathFormat, convertRenameOperand].reduce(
    (operation, convertFn) => convertFn(operation),
    updateOperation
  );
}

function convertRenameOperand(
  operation: GeneralUpdateOperation
): GeneralUpdateOperation {
  const renameOperator = operation.$rename;
  if (!renameOperator) return operation;

  const renameOperatorWithParent = Object.keys(renameOperator).reduce(
    (operator: UpdateOperand<"$rename">, key: string) => {
      operator[key] = key
        .split(".")
        .slice(0, -1)
        .concat(renameOperator[key])
        .join(".");
      return operator;
    },
    {}
  );
  return Object.assign({}, operation, { $rename: renameOperatorWithParent });
}

function convertDocumentPathFormat(
  updateOperation: GeneralUpdateOperation
): GeneralUpdateOperation {
  return visitUpdateOperation(updateOperation, {
    operation: (op: UpdateOperand<"$set">) => {
      return Object.keys(op).reduce((acc: any, srcKey: string) => {
        const dstKey = convertToDotNotationString(srcKey);
        acc[dstKey] = op[srcKey];
        return acc;
      }, {});
    },
  });
}
