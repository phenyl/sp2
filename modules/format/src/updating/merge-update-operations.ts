import { GeneralRegularUpdateOperation } from "./update-operation";
import deepMerge from "deepmerge";
import { normalizeUpdateOperation } from "./normalize-update-operation";

/**
 * Merge update operations.
 * TODO: Currently there are some cases are not merged well (See test cases.)
 */
export function mergeUpdateOperations(
  ...operationList: Array<Object>
): GeneralRegularUpdateOperation {
  return deepMerge.all(operationList.map(normalizeUpdateOperation));
}
