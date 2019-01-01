import {
  UpdateOperand,
  UpdateOperation,
  UpdateOperator,
  UpdateValue,
} from "./update-operation";

import { DocumentPath } from "../common/document-path";

type KeyValuePair<OP extends UpdateOperator> = [DocumentPath, UpdateValue<OP>];

export function createUpdateOperation<OP extends UpdateOperator>(
  operator: OP,
  ...params: KeyValuePair<OP>[]
): UpdateOperation<OP>;

export function createUpdateOperation<OP extends UpdateOperator>(
  operator: OP,
  key: DocumentPath,
  value: UpdateValue<OP>
): UpdateOperation<OP>;

export function createUpdateOperation<OP extends UpdateOperator>(
  operator: OP,
  ...params: KeyValuePair<OP>[] | KeyValuePair<OP>
): UpdateOperation<OP> {
  if (isKeyValuePair(params)) {
    const [docPath, value] = params;
    // @ts-ignore compatible with UpdateOperation<OP>
    return { [operator]: { [docPath]: value } };
  }
  // @ts-ignore compatible with UpdateOperation<OP>
  return {
    [operator]: params.reduce(
      (acc, [docPath, value]) => {
        acc[docPath] = value;
        return acc;
      },
      <UpdateOperand<OP>>{}
    ),
  };
}

function isKeyValuePair<OP extends UpdateOperator>(
  val: KeyValuePair<OP>[] | KeyValuePair<OP>
): val is KeyValuePair<OP> {
  return val.length === 2 && typeof val[0] === "string";
}

export const updateOpearationCreator = {
  $set: (...params: any[]): UpdateOperation<"$set"> =>
    createUpdateOperation("$set", ...params),

  $inc: (...params: any[]): UpdateOperation<"$inc"> =>
    createUpdateOperation("$inc", ...params),

  $min: (...params: any[]): UpdateOperation<"$min"> =>
    createUpdateOperation("$min", ...params),

  $max: (...params: any[]): UpdateOperation<"$max"> =>
    createUpdateOperation("$max", ...params),

  $mul: (...params: any[]): UpdateOperation<"$mul"> =>
    createUpdateOperation("$mul", ...params),

  $addToSet: (...params: any[]): UpdateOperation<"$addToSet"> =>
    createUpdateOperation("$addToSet", ...params),

  $pop: (...params: any[]): UpdateOperation<"$pop"> =>
    createUpdateOperation("$pop", ...params),

  $pull: (...params: any[]): UpdateOperation<"$pull"> =>
    createUpdateOperation("$pull", ...params),

  $push: (...params: any[]): UpdateOperation<"$push"> =>
    createUpdateOperation("$push", ...params),

  $currentDate: (...params: any[]): UpdateOperation<"$currentDate"> =>
    createUpdateOperation("$currentDate", ...params),

  $bit: (...params: any[]): UpdateOperation<"$bit"> =>
    createUpdateOperation("$bit", ...params),

  $unset: (...params: any[]): UpdateOperation<"$unset"> =>
    createUpdateOperation("$unset", ...params),

  $restore: (...params: any[]): UpdateOperation<"$restore"> =>
    createUpdateOperation("$restore", ...params),

  $rename: (...params: any[]): UpdateOperation<"$rename"> =>
    createUpdateOperation("$rename", ...params),
};

Object.freeze(updateOpearationCreator);
