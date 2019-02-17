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
