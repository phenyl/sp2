import {
  ComparisonQueryOperator,
  ComplexFindOperation,
  FindOperation,
  QueryCondition,
  SimpleFindOperation,
  getBSONTypeNumber,
  getBSONTypeString,
  getNestedValue,
  isAndFindOperation,
  isNorFindOperation,
  isOrFindOperation,
  isQueryCondition,
  normalizeQueryCondition,
} from "@sp2/format";

import deepEqual from "fast-deep-equal";

type Classified<T> = {
  ok: T[];
  ng: T[];
};

/**
 * Filter given values by an operation.
 */
export function retrieve<T extends Object>(
  values: T[],
  where: FindOperation
): T[] {
  return Retriever.classify(values, where).ok;
}

/**
 * Check if a given value matches the condition.
 */
export function checkCondition(value: any, condition: QueryCondition): boolean {
  return Retriever.checkCondition(value, condition);
}

/**
 * Classify values into OK or NG by given ComplexFindOperation.
 * Used internally at @sp2/updater and not for library users.
 *
 * `ComplexFindOperation` is one of these three types.
 *
 * 1. `SimpleFindOperation` (Object)
 * 2. `QueryCondition` (e.g. `{ $eq: "foo" }` )
 * 3. `JSONValue` (number|string|boolean|Array)
 */
export function classifyByComplexFindOperation<T>(
  values: T[],
  cond: ComplexFindOperation
): Classified<T> {
  let condition: QueryCondition;
  // case 1. cond is just a value ( => convert to { $eq: cond } )
  // case 2. cond is QueryCondition
  if (
    typeof cond !== "object" ||
    Array.isArray(cond) ||
    isQueryCondition(cond)
  ) {
    condition = normalizeQueryCondition(cond);
    return values.reduce(
      (classified, val) => {
        if (checkCondition(val, condition)) {
          classified.ok.push(val);
        } else {
          classified.ng.push(val);
        }
        return classified;
      },
      { ok: [], ng: [] } as Classified<T>
    );
  }
  // case 3. cond is SimpleFindOperation ($nor means using unmateched ones)
  return Retriever.classify(values, cond);
}

/**
 *
 */
class Retriever {
  /**
   * @private
   * Classify values into match or unmatch groups
   */
  static classify<T extends Object>(
    values: T[],
    where: FindOperation
  ): Classified<T> {
    if (isAndFindOperation(where)) {
      return where.$and.reduce(
        (vals, conds) => {
          const { ok, ng } = this.classify(vals.ok, conds);
          return { ok, ng: vals.ng.concat(ng) };
        },
        { ok: values, ng: <T[]>[] }
      );
    }

    if (isNorFindOperation(where)) {
      return where.$nor.reduce(
        (vals, conds) => {
          const { ok, ng } = this.classify(vals.ok, conds);
          return { ok: ng, ng: vals.ng.concat(ok) };
        },
        { ok: values, ng: <T[]>[] }
      );
    }

    if (isOrFindOperation(where)) {
      return where.$or.reduce(
        (vals, conds) => {
          const { ok, ng } = this.classify(vals.ng, conds);
          return { ok: vals.ok.concat(ok), ng };
        },
        { ok: <T[]>[], ng: values }
      );
    }
    return this.classifySimpleFindOperation(values, where);
  }

  static classifySimpleFindOperation<T>(
    values: T[],
    where: SimpleFindOperation
  ): Classified<T> {
    const documentPaths = Object.keys(where);
    return values.reduce(
      (classified, value) => {
        const isOk = documentPaths.every(documentPath => {
          const queryCondition = where[documentPath];
          const nestedValue = getNestedValue(value, documentPath);
          return this.checkCondition(
            nestedValue,
            normalizeQueryCondition(queryCondition)
          );
        });
        classified[isOk ? "ok" : "ng"].push(value);
        return classified;
      },
      { ok: <T[]>[], ng: <T[]>[] }
    );
  }

  /**
   * Check if leftOperand matches the condition
   */
  static checkCondition(leftOperand: any, condition: QueryCondition): boolean {
    const operators = Object.keys(condition);
    return operators.every(operator => {
      switch (operator) {
        case "$eq":
        case "$gt":
        case "$gte":
        case "$lt":
        case "$lte":
        case "$ne":
          return this.compare(operator, leftOperand, condition[operator]);

        case "$in":
        case "$nin":
          return this.compareIn(operator, leftOperand, condition[operator]!);

        case "$not":
          return this.checkCondition(leftOperand, condition.$not!) === false;

        case "$exists":
          return (leftOperand != null) === condition.$exists;

        case "$type":
          return typeof condition.$type === "number"
            ? getBSONTypeNumber(leftOperand) === condition.$type
            : getBSONTypeString(leftOperand) === condition.$type;

        case "$mod": {
          const [divisor, remainder] = condition.$mod!;
          return leftOperand % divisor === remainder;
        }

        case "$regex": {
          const regex =
            typeof condition.$regex === "string"
              ? new RegExp(condition.$regex, condition.$options)
              : condition.$regex!;
          return regex.test(leftOperand);
        }
        case "$text":
        case "$where":
        case "$geoIntersects":
        case "$geoWithin":
        case "$near":
        case "$nearSphere":
          throw new Error(
            `Operator "${operator}" is currently unimplemented in @sp2/retriever.`
          );
        case "$all":
          if (!Array.isArray(leftOperand)) return false;
          return condition.$all!.every(val =>
            leftOperand.some(elem => deepEqual(elem, val))
          );

        case "$elemMatch":
          if (!Array.isArray(leftOperand)) return false;
          return (
            classifyByComplexFindOperation(leftOperand, condition.$elemMatch!)
              .ok.length > 0
          );

        case "$size":
          if (!Array.isArray(leftOperand)) return false;
          return leftOperand.length === condition.$size;

        case "$bitsAllClear":
        case "$bitsAllSet":
        case "$bitsAnyClear":
        case "$bitsAnySet":
          throw new Error(
            `Operator "${operator}" is currently unimplemented in @sp2/retriever.`
          );

        // co-operator of $regex
        case "$options":
          return true;

        default:
          throw new Error(`Unknown operator: "${operator}".`);
      }
    });
  }

  /**
   * Compare values
   * when to query an array for an element
   * return true if the array field contains at least one matched element
   * @see https://docs.mongodb.com/manual/tutorial/query-arrays/#query-an-array-for-an-element
   */
  private static compareIn(
    operator: "$in" | "$nin",
    target: any,
    condValues: any[]
  ): boolean {
    if (!Array.isArray(target)) {
      return COMPARE_FUNC[operator](target, condValues);
    }

    const isIn = condValues.some(condValue =>
      this.compare("$eq", target, condValue)
    );
    return operator === "$in" ? isIn : !isIn;
  }

  static compare(
    operator: ComparisonQueryOperator,
    target: any,
    condValue: any
  ): boolean {
    let compareFunc = COMPARE_FUNC[operator];
    const isQueryArrayForAnElement =
      Array.isArray(target) && !Array.isArray(condValue);

    if (isQueryArrayForAnElement) {
      if (operator === "$ne") {
        compareFunc = COMPARE_FUNC["$eq"];
        // @ts-ignore target is Array.
        return !target.some(val => compareFunc(val, condValue));
      }
      // @ts-ignore target is Array.
      return target.some(val => compareFunc(val, condValue));
    }

    return compareFunc(target, condValue);
  }
}

const COMPARE_FUNC: {
  [K in ComparisonQueryOperator]: (val1: any, val2: any) => boolean
} = {
  $eq: deepEqual,
  $gt: (t, c) => t > c,
  $gte: (t, c) => t >= c,
  $in: (t, c: any[]) => c.some(v => deepEqual(t, v)),
  $lt: (t, c) => t < c,
  $lte: (t, c) => t <= c,
  $ne: (t, c) => !deepEqual(t, c),
  $nin: (t, c: any[]) => !c.some(v => deepEqual(t, v)),
};
