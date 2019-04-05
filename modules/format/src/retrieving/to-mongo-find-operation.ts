import {
  ComplexFindOperation,
  FindOperation,
  SimpleFindOperation,
  complexFindOperationIsSimpleFindOperation,
} from "./find-operation";

import { QueryCondition } from "./query-condition";
import { convertToDotNotationString } from "../common/document-path";
import { visitFindOperation } from "./visit-find-operation";

export function toMongoFindOperation<T extends FindOperation>(operation: T): T {
  return visitFindOperation(operation, {
    simpleFindOperation: simpleFindOperationToMongoFindOperation,
  });
}

function simpleFindOperationToMongoFindOperation(
  operation: SimpleFindOperation
): SimpleFindOperation {
  return [convertDocumentPathFormat, convertElemMatchOperand].reduce(
    (operation, convertFn) => convertFn(operation),
    operation
  );
}

function convertDocumentPathFormat(
  simpleFindOperation: SimpleFindOperation
): SimpleFindOperation {
  return Object.keys(simpleFindOperation).reduce(
    (operation: any, srcKey: string) => {
      const dstKey = convertToDotNotationString(srcKey);
      operation[dstKey] = simpleFindOperation[srcKey];
      return operation;
    },
    {}
  );
}

function convertElemMatchOperand(
  operation: SimpleFindOperation
): SimpleFindOperation {
  return visitFindOperation(operation, {
    queryCondition: (queryCondition: QueryCondition) => {
      const elemMatchOperand = queryCondition.$elemMatch;
      if (!elemMatchOperand) return queryCondition;
      const convertedOperand = convertComplexFindOperationToMongoFormat(
        elemMatchOperand
      );
      return Object.assign({}, queryCondition, {
        $elemMatch: convertedOperand,
      });
    },
  });
}

// Utility function to be used at toMongoUpdateOperation()
export function convertComplexFindOperationToMongoFormat(
  complexFindOperation: ComplexFindOperation
): ComplexFindOperation {
  if (complexFindOperationIsSimpleFindOperation(complexFindOperation)) {
    return toMongoFindOperation(complexFindOperation);
  }
  return complexFindOperation;
}
