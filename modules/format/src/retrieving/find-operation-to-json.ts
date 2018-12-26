import { FindOperation } from "./find-operation";
import { QueryCondition } from "./query-condition";
import { visitFindOperation } from "./visit-find-operation";

/**
 *
 */
export function findOperationToJSON(where: FindOperation): FindOperation {
  return visitFindOperation(where, {
    queryCondition(condition: QueryCondition) {
      return queryConditionToJSON(condition);
    },
  });
}

/**
 *
 */
export function queryConditionToJSON(
  queryCondition: QueryCondition
): QueryCondition {
  if (
    queryCondition.$regex == null ||
    typeof queryCondition.$regex === "string"
  ) {
    return queryCondition;
  }

  const { pattern, flags } = regexToJSON(queryCondition.$regex);
  const newCondition = flags
    ? { $regex: pattern, $options: flags }
    : { $regex: pattern };
  return Object.assign({}, queryCondition, newCondition);
}

function regexToJSON(regex: RegExp): { pattern: string; flags?: string } {
  const matched = regex.toString().match(/\/(.*?)\/([gimy]*)?$/);
  // @ts-ignore stringified regex always match the pattern.
  return { pattern: matched[1], flags: matched[2] };
}
