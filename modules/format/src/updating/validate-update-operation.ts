import {
  DocumentPath,
  createDocumentPath,
  parseDocumentPath,
} from "../common/document-path";

import { UpdateOperationOrSetOperand } from "./update-operation";
import { normalizeUpdateOperation } from "./normalize-update-operation";

export type UpdateOperationValidationResult =
  | {
      valid: true;
      errors: [];
    }
  | {
      valid: false;
      errors: Error[];
    };
/**
 * Check if the given update operation is valid.
 */
export function validateUpdateOperation(
  operation: UpdateOperationOrSetOperand
): UpdateOperationValidationResult {
  const errors: Error[] = [];
  const normalizedOperation = normalizeUpdateOperation(operation);
  const docPaths: { [path: string]: DocumentPath } = Object.values(
    normalizedOperation
  )
    .filter(isNotUndefined)
    .map(operand => Object.keys(operand))
    .reduce(
      (acc, paths) => {
        paths.forEach(path => {
          if (acc[path] != null) {
            errors.push(
              new Error(
                `Updating the path '${path}' would create a conflict at '${path}'`
              )
            );
          }
          acc[path] = path;
        });
        return acc;
      },
      {} as { [path: string]: DocumentPath }
    );
  Object.keys(docPaths).forEach(path => {
    const attributes = parseDocumentPath(path);
    for (let i = 1; i <= attributes.length - 1; i++) {
      const partialPath = createDocumentPath(...attributes.slice(0, i));
      if (docPaths[partialPath] != null) {
        errors.push(
          new Error(
            `Updating the path '${path}' would create a conflict at '${
              docPaths[partialPath]
            }'`
          )
        );
      }
    }
  });
  return errors.length === 0
    ? { valid: true, errors: [] }
    : { valid: false, errors };
}

function isNotUndefined<T>(v: T | undefined): v is T {
  return v != null;
}
