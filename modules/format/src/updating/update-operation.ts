import { EqCondition, QueryCondition } from "../retrieving/query-condition";

import { SimpleFindOperation } from "../retrieving/find-operation";
import { SortNotation } from "../common/sort-by-notation";

/**
 * Abstract:
 *
 * ```
 *   const op: UpdateOperation<"$set"> = {
 *     $set: { 'name.first': 'John' }
 *   };
 * ```
 * - UpdateOperations are format expressing how to modify objects.
 *   This example means this operation will update object's name.first field to "John".
 *
 * - The object "op" is UpdateOperation.
 *
 * - "$set" is UpdateOperator. Other operators are "$inc", "$min", etc...
 *   All the operators are the same meaning as MongoDB's update operators except "$restore" and "$rename".
 *   See https://docs.mongodb.com/manual/reference/operator/update/
 *   See the comment below on RestoreOperand and RenameOperand for $restore and $rename operators.
 *
 * - "{ 'name.first': 'John' }"  is UpdateOperand<"$set">.
 *   UpdateOperand is a mapped object.
 *   Its keys (in this example, "name.first") are DocumentPath (string).
 *   See ./document-path.ts for DocumentPath.
 *
 * - "John" is the value in the UpdateOperand.
 *    Type of these values are defined in WholeRegularUpdateOperandItemValue for each UpdateOperand.
 *   "Regular" means canonical format used for internal processes.
 *   Broader format is allowed for library users. It's defined in BroaderUpdateOperandItemValue.
 */

/**
 * Values of the items required in each UpdateOperation.
 * "Regular" means canonical format used for internal processes.
 */
export type WholeRegularUpdateOperandItemValue = {
  $set: any;
  $inc: number;
  $min: number | string;
  $max: number | string;
  $mul: number;
  $addToSet: { $each: any[] };
  $pop: 1 | -1;
  $pull: QueryCondition | EqCondition | SimpleFindOperation;
  $push: RegularPushOperandItemValue<any>;
  $currentDate: true | { $type: "timestamp" | "date" };
  $bit: { and?: number; or?: number; xor?: number };
  $unset: "";
  $restore: "" | ({ new (plain: Object): Object }); // strictFunctionTypes should be false.
  $rename: string;
};

export type RegularPushOperandItemValue<T> = {
  $each: T[];
  $slice?: number;
  $sort?: SortNotation;
  $position?: number;
};

export type RegularUpdateOperandItemValue<
  OP extends UpdateOperator
> = WholeRegularUpdateOperandItemValue[OP];

/**
 * Extended definition of the items in UpdateOperation for library users to write.
 */
export type BroaderUpdateOperandItemValue = {
  $addToSet: any;
  $push: any;
};

/**
 * Value of the given UpdateOperator, combining regular and broader items.
 * e.g.
 * UpdateOperandItemValue<"$set"> is `any`
 * UpdateOperandItemValue<"$inc"> is `number`
 */
export type UpdateOperandItemValue<
  OP extends UpdateOperator
> = OP extends keyof BroaderUpdateOperandItemValue
  ? BroaderUpdateOperandItemValue[OP] | WholeRegularUpdateOperandItemValue[OP]
  : WholeRegularUpdateOperandItemValue[OP];

/**
 * Object containing whole the operator and regular operands.
 * Its form is like the following.
 * {
 *   $set: { [docPath: string]: any },
 *   $inc: { [docPath: string]: number },
 *   ...
 * }
 */
export type WholeRegularUpdateOperation = {
  [K in keyof WholeRegularUpdateOperandItemValue]: {
    [docPath: string]: WholeRegularUpdateOperandItemValue[K];
  }
};

/**
 * Object containing whole the operator and broader operands.
 * Its form is like the following.
 * {
 *   $set: { [docPath: string]: any },
 *   $inc: { [docPath: string]: number },
 *   ...
 * }
 */
export type WholeUpdateOperation = {
  [K in keyof WholeRegularUpdateOperandItemValue]: {
    [docPath: string]: UpdateOperandItemValue<K>;
  }
};

/**
 * "$set", "$inc", etc...
 */
export type UpdateOperator = keyof WholeUpdateOperation;

/**
 * Mapped object with DocumentPath and its value.
 * Its form is like the following.
 * { [docPath: string]: any }
 */
export type RegularUpdateOperand<
  OP extends UpdateOperator
> = WholeRegularUpdateOperation[OP];

/**
 * Mapped object with DocumentPath and its value.
 * Its form is like the following.
 * { [docPath: string]: any }
 */
export type UpdateOperand<OP extends UpdateOperator> = WholeUpdateOperation[OP];

/**
 * Object containing operator with regular UpdateOperand.
 * Its form is like the following.
 * { $set: { [docPath: string]: any } }
 */
export type RegularUpdateOperation<OP extends UpdateOperator> = Pick<
  WholeRegularUpdateOperation,
  OP
>;

/**
 * Object containing operator with broader UpdateOperand.
 * Its form is like the following.
 * { $set: { [docPath: string]: any } }
 */
export type UpdateOperation<OP extends UpdateOperator> = Pick<
  WholeUpdateOperation,
  OP
>;

/**
 * One of UpdateOperation.
 */
export type GeneralUpdateOperation = Partial<WholeUpdateOperation>;

/**
 * One of RegularUpdateOperation.
 */
export type GeneralRegularUpdateOperation = Partial<
  WholeRegularUpdateOperation
>;

/**
 * RenameOperand
 * a bit different operator from MongoDB's $rename operator
 * https://docs.mongodb.com/manual/reference/operator/update/rename/
 *
 * The values are not 'DotNotationString's but field names.
 * The following sample object in mongodb
 * { $rename: { "name.first": "name.fname" } }
 *
 * will be the following object in @sp2/updater.
 *
 * { $rename: { "name.first": "fname" } }
 *
 * See that the value doesn't contain "name".
 * When this operator is passed to MongoDB via phenyl-mongodb,
 * new field names will be automatically corrected to fit the MongoDB's spec.
 */
export type RenameOperand = UpdateOperand<"$rename">;

/**
 * New operator which construct instances of the given path
 * Notice:
 *
 * Once RestoreOperand is JSON.stringify-ed, the fields with Class<Restorable> will be removed.
 * To avoid this, you can choose two alternatives.
 *
 * 1) Implement static method toJSON() to Classes
 *   class Foo {
 *     static toJSON() { return '' }
 *   }
 *
 * 2) Use updateOperationToJSON() function exported from oad-utils
 *    import { updateOperationToJSON } from 'oad-utils/jsnext'
 *    const operation: UpdateOperation = { $restore: { foo: Foo } }
 *    JSON.stringify(updateOperationToJSON(operation)) // {"$restore":{"foo":""}}
 */
export type RestoreOperand = UpdateOperand<"$restore">;

// Defined for the integrity of allUpdateOperators.
const allUpdateOperatorMap: { [K in keyof WholeUpdateOperation]: 1 } = {
  $set: 1,
  $inc: 1,
  $min: 1,
  $max: 1,
  $mul: 1,
  $addToSet: 1,
  $pop: 1,
  $pull: 1,
  $push: 1,
  $currentDate: 1,
  $bit: 1,
  $unset: 1,
  $restore: 1,
  $rename: 1,
};

Object.freeze(allUpdateOperatorMap);

/**
 * All update operators.
 *
 * DO NOT directly modify this array at any libraries.
 * Use allUpdateOperators.slice() for modification.
 */
// @ts-ignore Object.keys().
export const allUpdateOperators: UpdateOperator[] = Object.keys(
  allUpdateOperatorMap
);

export type UpdateOperationOrSetOperand =
  | UpdateOperand<"$set">
  | GeneralUpdateOperation;

type NonFunctionPropNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

type NonFunctionProps<T> = Pick<T, NonFunctionPropNames<T>>;

interface DecoratorFunction<T> {
  <Ctr extends { new (params: NonFunctionProps<T>): any }>(
    constructor: Ctr
  ): void;
}

export function Restorable<T>(): DecoratorFunction<T> {
  // @ts-ignore
  return () => {};
}
