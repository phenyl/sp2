import {
  GeneralRegularUpdateOperation,
  NonBreakingRegularUpdateOperation,
  NonBreakingUpdateOperationOrSetOperand,
  RegularUpdateOperand,
  UpdateOperationOrSetOperand,
  UpdateOperator,
} from "./update-operation";

import { normalizeUpdateOperation } from "./normalize-update-operation";

/**
 * Merge update operations.
 * TODO: Currently there are some cases are not merged well (See test cases.)
 */
export function mergeUpdateOperations(
  ...operationList: NonBreakingUpdateOperationOrSetOperand[]
): NonBreakingRegularUpdateOperation;

// eslint-disable-next-line no-redeclare
export function mergeUpdateOperations(
  ...operationList: UpdateOperationOrSetOperand[]
): GeneralRegularUpdateOperation;

// eslint-disable-next-line no-redeclare
export function mergeUpdateOperations(
  ...operationList: Object[]
): GeneralRegularUpdateOperation {
  return mergeNormalizedUpdateOperations(
    ...operationList.map(normalizeUpdateOperation)
  );
}

export function mergeNormalizedUpdateOperations(
  ...operations: GeneralRegularUpdateOperation[]
): GeneralRegularUpdateOperation {
  const ret: GeneralRegularUpdateOperation = {};
  operations.forEach((operation) => {
    Object.entries(operation).forEach(([k, v]) => {
      if (!(k in ret)) {
        // @ts-ignore
        ret[k] = Object.assign({}, v);
      } else if (k === "$push" || k === "$addToSet") {
        // @ts-ignore
        ret[k] = mergeArrayOperand(ret[k], v);
      } else if (k === "$inc") {
        // @ts-ignore
        ret[k] = mergeIncOperand(ret[k], v);
      } else if (k === "$min") {
        // @ts-ignore
        ret[k] = mergeMinOperand(ret[k], v);
      } else if (k === "$max") {
        // @ts-ignore
        ret[k] = mergeMaxOperand(ret[k], v);
      } else if (k === "$mul") {
        // @ts-ignore
        ret[k] = mergeMulOperand(ret[k], v);
      } else if (k === "$pull") {
        // @ts-ignore
        ret[k] = mergePullOperand(ret[k], v);
      } else {
        // @ts-ignore
        ret[k] = overwriteOperand(ret[k], v);
      }
    });
  });
  return ret;
}

function mergeIncOperand<OP extends "$inc">(
  operand1: RegularUpdateOperand<OP>,
  operand2: RegularUpdateOperand<OP>
): RegularUpdateOperand<OP> {
  const ret: RegularUpdateOperand<OP> = Object.assign({}, operand1);

  Object.entries(operand2).forEach(([k, v]) => {
    if (k in ret) {
      ret[k] = ret[k] + v;
    } else {
      ret[k] = v;
    }
  });
  return ret;
}

function mergeMinOperand<OP extends "$min">(
  operand1: RegularUpdateOperand<OP>,
  operand2: RegularUpdateOperand<OP>
): RegularUpdateOperand<OP> {
  const ret: RegularUpdateOperand<OP> = Object.assign({}, operand1);

  Object.entries(operand2).forEach(([k, v]) => {
    if (k in ret) {
      // @ts-ignore
      ret[k] = Math.min(ret[k], v);
    } else {
      ret[k] = v;
    }
  });
  return ret;
}

function mergeMaxOperand<OP extends "$max">(
  operand1: RegularUpdateOperand<OP>,
  operand2: RegularUpdateOperand<OP>
): RegularUpdateOperand<OP> {
  const ret: RegularUpdateOperand<OP> = Object.assign({}, operand1);

  Object.entries(operand2).forEach(([k, v]) => {
    if (k in ret) {
      // @ts-ignore
      ret[k] = Math.max(ret[k], v);
    } else {
      ret[k] = v;
    }
  });
  return ret;
}

function mergeMulOperand<OP extends "$mul">(
  operand1: RegularUpdateOperand<OP>,
  operand2: RegularUpdateOperand<OP>
): RegularUpdateOperand<OP> {
  const ret: RegularUpdateOperand<OP> = Object.assign({}, operand1);

  Object.entries(operand2).forEach(([k, v]) => {
    if (k in ret) {
      ret[k] = ret[k] * v;
    } else {
      ret[k] = v;
    }
  });
  return ret;
}

function mergePullOperand<OP extends "$pull">(
  operand1: RegularUpdateOperand<OP>,
  operand2: RegularUpdateOperand<OP>
): RegularUpdateOperand<OP> {
  const ret: RegularUpdateOperand<OP> = Object.assign({}, operand1);
  Object.entries(operand2).forEach(([k, v]) => {
    if (k in ret) {
      const query1 = ret[k];
      const query2 = v;
      if ("$eq" in query1 && "$eq" in query2) {
        // case: {anyPath: $eq: anyValue} + {anyPath: $eq: anyValue}
        const value1 = query1["$eq"];
        const value2 = query2["$eq"];
        if (value1 == value2) {
          ret[k] = v;
        } else {
          ret[k] = { $in: [query1["$eq"], query2["$eq"]] };
        }
      } else if ("$in" in query1 && "$eq" in query2) {
        // case: {anyPath: $in: [anyValues]} + {anyPath: $eq: anyValue}
        const values = query1["$in"] as any[];
        const value = query2["$eq"];
        if (values.includes(value)) {
          ret[k] = query1;
        } else {
          ret[k] = { $in: [...values, value] };
        }
      } else if ("$in" in query2 && "$eq" in query1) {
        // case: {anyPath: $eq: anyValue} + {anyPath: $in: [anyValues]}
        const values = query2["$in"] as any[];
        const value = query1["$eq"];
        if (values.includes(value)) {
          ret[k] = query2;
        } else {
          ret[k] = { $in: [value, ...values] };
        }
      } else if ("$in" in query1 && "$in" in query2) {
        // case: {anyPath: $in: [anyValues]} + {anyPath: $in: [anyvalues]}
        const values1 = query1["$in"] as any[];
        const values2 = query2["$in"] as any[];
        ret[k] = { $in: Array.from(new Set(values1.concat(values2))) };
      }
    } else {
      ret[k] = v;
    }
  });
  return ret;
}

function overwriteOperand<
  OP extends Exclude<
    UpdateOperator,
    "$push" | "$addToSet" | "$inc" | "$mul" | "$min" | "$max"
  >
>(
  operand1: RegularUpdateOperand<OP>,
  operand2: RegularUpdateOperand<OP>
): RegularUpdateOperand<OP> {
  return Object.assign({}, operand1, operand2);
}

function mergeArrayOperand<OP extends "$push" | "$addToSet">(
  arrayOperand1: RegularUpdateOperand<OP>,
  arrayOperand2: RegularUpdateOperand<OP>
): RegularUpdateOperand<OP> {
  const ret: RegularUpdateOperand<OP> = Object.assign({}, arrayOperand1);

  Object.entries(arrayOperand2).forEach(([k, v]) => {
    if (k in ret) {
      const $each = [...ret[k].$each, ...v.$each];
      ret[k] = Object.assign({}, ret[k], { $each });
    } else {
      ret[k] = v;
    }
  });
  return ret;
}
