import { GeneralUpdateOperation, UpdateOperand } from "./update-operation";

import { convertComplexFindOperationToMongoFormat } from "../retrieving/to-mongo-find-operation";
import { convertToDotNotationString } from "../common/document-path";
import { visitUpdateOperation } from "./visit-update-operation";

export function toMongoUpdateOperation(
  updateOperation: GeneralUpdateOperation
): GeneralUpdateOperation {
  // The order is important. convertRenameOperand must be put after convertDocumentPathFormat
  return [
    convertDocumentPathFormat,
    convertRenameOperand,
    convertPullOperand,
  ].reduce((operation, convertFn) => convertFn(operation), updateOperation);
}

function convertRenameOperand(
  operation: GeneralUpdateOperation
): GeneralUpdateOperation {
  const renameOperand = operation.$rename;
  if (!renameOperand) return operation;

  const convertedRenameOperand = Object.keys(renameOperand).reduce(
    (operand: UpdateOperand<"$rename">, key: string) => {
      operand[key] = key
        .split(".")
        .slice(0, -1)
        .concat(renameOperand[key])
        .join(".");
      return operand;
    },
    {}
  );
  return Object.assign({}, operation, { $rename: convertedRenameOperand });
}

function convertPullOperand(
  operation: GeneralUpdateOperation
): GeneralUpdateOperation {
  const pullOperand = operation.$pull;
  if (!pullOperand) return operation;

  const convertedPullOperand = Object.keys(pullOperand).reduce(
    (operand: UpdateOperand<"$pull">, key: string) => {
      operand[key] = convertComplexFindOperationToMongoFormat(pullOperand[key]);
      return operand;
    },
    {}
  );
  return Object.assign({}, operation, { $pull: convertedPullOperand });
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
