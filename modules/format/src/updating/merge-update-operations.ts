import {
  GeneralRegularUpdateOperation,
  GeneralUpdateOperation,
  NonBreakingRegularUpdateOperation,
  NonBreakingUpdateOperation,
  UpdateOperand,
} from "./update-operation";

import deepMerge from "deepmerge";
import { normalizeUpdateOperation } from "./normalize-update-operation";

/**
 * Merge update operations.
 * TODO: Currently there are some cases are not merged well (See test cases.)
 */
export function mergeUpdateOperations(
  ...operationList: (NonBreakingUpdateOperation | UpdateOperand<"$set">)[]
): NonBreakingRegularUpdateOperation;

export function mergeUpdateOperations(
  ...operationList: (GeneralUpdateOperation | UpdateOperand<"$set">)[]
): GeneralRegularUpdateOperation;

export function mergeUpdateOperations(
  ...operationList: Object[]
): GeneralRegularUpdateOperation {
  return deepMerge.all(operationList.map(normalizeUpdateOperation));
}
