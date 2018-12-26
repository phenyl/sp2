import {
  GeneralRegularUpdateOperation,
  GeneralUpdateOperation,
  RegularUpdateOperand,
  UpdateOperand,
  UpdateOperationOrSetOperand,
} from "./update-operation";

/**
 * 1. When no operators are found, convert it into $set operator.
 * 2. Normalize $addToSet.
 * 3. Normalize $pull.
 * 4. Normalize $push.
 */
export function normalizeUpdateOperation(
  _operation: UpdateOperationOrSetOperand
): GeneralRegularUpdateOperation {
  let operation = toUpdateOperation(_operation);
  if (operation.$addToSet != null) {
    operation = Object.assign({}, operation, {
      $addToSet: normalizeAddToSetOperand(operation.$addToSet),
    });
  }
  if (operation.$push != null) {
    operation = Object.assign({}, operation, {
      $push: normalizePushOperand(operation.$push),
    });
  }
  // @ts-ignore compatible with RegularUpdateOperation.
  return operation;
}

function normalizeAddToSetOperand(
  $addToSet: UpdateOperand<"$addToSet">
): RegularUpdateOperand<"$addToSet"> {
  const modified: RegularUpdateOperand<"$addToSet"> = {};
  Object.keys($addToSet).forEach(docPath => {
    let modifier = $addToSet[docPath];

    // Is type of newVal PushModifier or just the value?
    if (modifier.$each == null) {
      modifier = { $each: [modifier] };
    }
    modified[docPath] = modifier;
  });
  return modified;
}

function normalizePushOperand(
  $push: UpdateOperand<"$push">
): RegularUpdateOperand<"$push"> {
  const modified: RegularUpdateOperand<"$push"> = {};
  Object.keys($push).forEach(docPath => {
    let modifier = $push[docPath];

    // Is type of newVal PushModifier or just the value?
    if (modifier.$each == null) {
      modifier = { $each: [modifier] };
    }
    modified[docPath] = modifier;
  });
  return modified;
}

/**
 * When no operators are found, convert it into $set operator.
 */
export function toUpdateOperation(operation: Object): GeneralUpdateOperation {
  const firstKey = Object.keys(operation)[0];
  if (!firstKey) return operation;
  if (firstKey.charAt(0) !== "$") return { $set: operation };
  return operation;
}
