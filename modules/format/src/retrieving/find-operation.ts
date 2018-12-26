import { EqCondition, QueryCondition } from "./query-condition";

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
