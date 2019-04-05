import {
  EqCondition,
  QueryCondition,
  firstKeyBeginsWithDollar,
} from "./query-condition";

export type SimpleFindOperation = {
  [docPath: string]: QueryCondition | EqCondition;
};

export type AndFindOperation = {
  $and: FindOperation[];
};
export type NorFindOperation = {
  $nor: FindOperation[];
};
export type OrFindOperation = {
  $or: FindOperation[];
};

export function isAndFindOperation(
  val: FindOperation
): val is AndFindOperation {
  // @ts-ignore
  return val.$and != null;
}

export function isNorFindOperation(
  val: FindOperation
): val is NorFindOperation {
  // @ts-ignore
  return val.$nor != null;
}

export function isOrFindOperation(val: FindOperation): val is OrFindOperation {
  // @ts-ignore
  return val.$or != null;
}

/**
 * Operation to find values in large JSON.
 */
export type FindOperation =
  | SimpleFindOperation
  | AndFindOperation
  | NorFindOperation
  | OrFindOperation;

/**
 * FindOperation or QueryCondition or EqCondition.
 * Used in $pull operator in UpdateOperation and $elemMatch operator in FindOperation.
 *
 * See the same usage of $pull in mongodb
 * https://docs.mongodb.com/manual/reference/operator/update/pull/
 *
 * See the same usage of $elemMatch in mongodb
 * https://docs.mongodb.com/manual/reference/operator/query/elemMatch/
 */
export type ComplexFindOperation =
  | SimpleFindOperation
  | QueryCondition
  | EqCondition;

export function complexFindOperationIsSimpleFindOperation(
  val: ComplexFindOperation
): val is SimpleFindOperation {
  if (typeof val !== "object" || val == null) {
    return false;
  }
  if (Array.isArray(val)) {
    return false;
  }
  if (firstKeyBeginsWithDollar(val)) {
    return false;
  }
  return true;
}
