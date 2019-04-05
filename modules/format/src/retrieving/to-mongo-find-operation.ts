import { FindOperation, SimpleFindOperation } from "./find-operation";

import { convertToDotNotationString } from "../common/document-path";
import { visitFindOperation } from "./visit-find-operation";

export function toMongoFindOperation(operation: FindOperation): FindOperation {
  return visitFindOperation(operation, {
    simpleFindOperation: convertDocumentPathFormat,
  });
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
