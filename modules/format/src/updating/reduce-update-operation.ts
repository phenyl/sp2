import {
  GeneralUpdateOperation,
  RegularUpdateOperand,
  RegularUpdateOperandItemValue,
  UpdateOperator,
} from "./update-operation";

import { DocumentPath } from "../common/document-path";
import { normalizeUpdateOperation } from "./normalize-update-operation";

export type UpdateOperandReducer<T, OP extends UpdateOperator> = (
  acc: T,
  docPath: string,
  value: RegularUpdateOperandItemValue<OP>,
  index: number
) => T;

export type UpdateOperationReducer<T, OP extends UpdateOperator> = (
  acc: T,
  operator: OP,
  operand: RegularUpdateOperand<OP>,
  index: number
) => T;

export function reduceUpdateOperand<T, OP extends UpdateOperator>(
  operand: RegularUpdateOperand<OP>,
  fn: UpdateOperandReducer<T, OP>,
  initialValue: T
): T {
  return Object.entries(operand).reduce((acc, val, i) => {
    const docPath: DocumentPath = val[0];
    const value: RegularUpdateOperandItemValue<OP> = val[1];
    return fn(acc, docPath, value, i);
  }, initialValue);
}

export function reduceUpdateOperation<T, OP extends UpdateOperator>(
  operation: GeneralUpdateOperation,
  fn: UpdateOperationReducer<T, OP>,
  initialValue: T
): T {
  const uOp = normalizeUpdateOperation(operation);
  return Object.entries(uOp).reduce((acc, val, i) => {
    // @ts-ignore operator is UpdateOperator
    const operator: UpdateOperator = val[0];
    // @ts-ignore operator is UpdateOperator
    const operand: RegularUpdateOperand<typeof operator> = val[1];
    if (!uOp[operator] == null) return acc;
    // @ts-ignore compatible
    return fn(acc, operator, operand, i);
  }, initialValue);
}
