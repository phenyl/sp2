import { ComplexFindOperation } from "../retrieving/find-operation";
import { SortNotation } from "../common/sort-by-notation";

/**
 * `GeneralUpdateOperation` contains all the types of `UpdateOperation`s.
 *
 *    const op: GeneralUpdateOperation = {
 *      $set: { 'name.first': 'John' },
 *      $inc: { age: 1 },
 *      $unset: { 'status.waiting': '' }
 *    };
 *
 * - UpdateOperations are format expressing how to modify objects.
 *   This example means this operation will do three things.
 *
 *   1. Set object's name.first field to "John".
 *   2. Increment +1 to object's age.
 *   3. Unset value of status.wating.
 *
 * - The object `op` is `GeneralUpdateOperation`.
 * - Partial value `{ $set { 'name.first': 'John' } }` is `UpDateOperation<"$set">`.
 * - Partial value `{ $inc { 'name.first': 'John' } }` is `UpDateOperation<"$inc">` and so on.
 *
 * - `$set`, `$inc` and `$unset` are types of `UpdateOperator`.
 *   All the operators are the same meaning as MongoDB's update operators except `$restore` and `$rename`.
 *   See https://docs.mongodb.com/manual/reference/operator/update/
 *   See the comment below on RestoreOperand and RenameOperand for $restore and $rename operators.
 *
 * - `{ 'name.first': 'John' }`  is `UpdateOperand<"$set">`.
 *   `UpdateOperand` is a mapped object.
 *   Its keys (in this example, `name.first`) are `DocumentPath` (string).
 *   See ./document-path.ts for `DocumentPath`.
 *
 * - `'John'` is the value in the `UpdateOperand`.
 *    Type of these values are defined in `RegularUpdateValue` for each `UpdateOperand`.
 *   "Regular" means canonical format used for internal processes.
 *   Broader format is allowed for library users. It's defined in `BroaderUpdateOperandItemValue`.
 */
export type GeneralUpdateOperation = Partial<UpdateOperationMap>;

/**
 * `GeneralRegularUpdateOperation` contains all the types of `RegularUpdateOperation`s.
 * It is more strictly-ruled format of `GeneralUpdateOperation`.
 *
 * This type is for internal use and library users don't have to follow it.
 */
export type GeneralRegularUpdateOperation = Partial<RegularUpdateOperationMap>;

/**
 * Partial value of `GeneralUpdateOperation`.
 * This type expresses how each `UpdateOperator` requires its own type of `UpdateOperand`.
 * `OP` is `UpdateOperator`; `$set`, `$inc` etc... are set.
 *
 * For more information, see description of `GeneralUpdateOperation`.
 */
export type UpdateOperation<OP extends UpdateOperator> = Pick<
  UpdateOperationMap,
  OP
>;

/**
 * Partial value of `GeneralRegularUpdateOperation`.
 */
export type RegularUpdateOperation<OP extends UpdateOperator> = Pick<
  RegularUpdateOperationMap,
  OP
>;

/**
 * `NonBreakingUpdateOperation` is subtype of `GeneralUpdateOperation` consisting of `NonBreakingOperator`s.
 *
 * There are two types of `UpdateOperator`s.
 * `NonBreakingOperator` keeps original type of objects after being applied.
 * `BreakingOperator` breaks original type of objects.
 */
export type NonBreakingUpdateOperation = Partial<
  Pick<UpdateOperationMap, NonBreakingOperator>
> &
  { [OP in BreakingOperator]?: never };

/**
 * `NonBreakingRegularUpdateOperation` is subtype of `GeneralRegularUpdateOperation` consisting of `NonBreakingOperator`s.
 *
 * There are two types of `UpdateOperator`s.
 * `NonBreakingOperator` keeps original type of objects after being applied.
 * `BreakingOperator` breaks original type of objects.
 */
export type NonBreakingRegularUpdateOperation = Partial<
  Pick<RegularUpdateOperationMap, NonBreakingOperator>
> &
  { [OP in BreakingOperator]?: never };

/**
 * `$set`, `$inc`, `$push`, `$unset` and other string types expressing type of operation.
 */
export type UpdateOperator = keyof UpdateOperationMap;

/**
 * Breaking operator.
 *
 * There are two types of `UpdateOperator`s.
 * `NonBreakingOperator` keeps original type of objects after being applied.
 * `BreakingOperator` breaks original type of objects.
 */
export type BreakingOperator = "$unset" | "$rename";

/**
 * Nonbreaking operator.
 *
 * There are two types of `UpdateOperator`s.
 * `NonBreakingOperator` keeps original type of objects after being applied.
 * `BreakingOperator` breaks original type of objects.
 */
export type NonBreakingOperator = Exclude<UpdateOperator, BreakingOperator>;

/**
 * Value of `UpdateOperation`, determined by its `UpdateOperand` as a key.
 * It's a mapped object with DocumentPath and its value.
 * Its form is like the following.
 *
 *    { [docPath: string]: (determined by UpdateOperator) }
 *
 * For more information, see description of `GeneralUpdateOperation`.
 *
 */
export type UpdateOperand<OP extends UpdateOperator> = {
  [docPath: string]: UpdateValue<OP>;
} & { [K in UpdateOperator]?: never };

/**
 * Value of `RegularUpdateOperation`, determined by its `UpdateOperand` as a key.
 * It's a mapped object with DocumentPath and its value.
 * It is more strictly-ruled format of `UpdageOperand`.
 * Its form is like the following.
 *
 *    { [docPath: string]: (determined by UpdateOperator) }
 *
 * For more information, see description of `GeneralUpdateOperation`.
 */
export type RegularUpdateOperand<OP extends UpdateOperator> = {
  [docPath: string]: RegularUpdateValue<OP>;
} & { [K in UpdateOperator]?: never };

/**
 * Values of the items required in each UpdateOperation.
 * "Regular" means canonical format used for internal processes.
 */
type RegularUpdateValueMap = {
  $set: any;
  $inc: number;
  $min: number | string;
  $max: number | string;
  $mul: number;
  $addToSet: { $each: any[] };
  $pop: 1 | -1;
  $pull: ComplexFindOperation;
  $push: RegularPushUpdateValue<any>;
  $currentDate: true | { $type: "timestamp" | "date" };
  $bit: { and?: number; or?: number; xor?: number };
  $unset: "";
  $restore: "" | ({ new (plain: Object): Object }); // strictFunctionTypes should be false.
  $rename: string;
  $append: Object;
};

export type RegularPushUpdateValue<T> = {
  $each: T[];
  $slice?: number;
  $sort?: SortNotation;
  $position?: number;
};

export type RegularUpdateValue<
  OP extends UpdateOperator
> = RegularUpdateValueMap[OP];

/**
 * Extended definition of the items in UpdateOperation for library users to write.
 * Some of the types are defined to avoid compiling error due to TypeScript's broader cast.
 */
type BroaderUpdateValueMap = {
  $pop: number;
  $addToSet: any;
  $push: any;
  $currentDate: true | { $type: string };
  $unset: string;
  $restore: string | ({ new (plain: Object): Object });
};

/**
 * Value of the given UpdateOperator, combining regular and broader items.
 * e.g.
 * UpdateOperandItemValue<"$set"> is `any`
 * UpdateOperandItemValue<"$inc"> is `number`
 */
export type UpdateValue<
  OP extends UpdateOperator
> = OP extends keyof BroaderUpdateValueMap
  ? BroaderUpdateValueMap[OP] | RegularUpdateValueMap[OP]
  : RegularUpdateValueMap[OP];

/**
 * Object containing whole the operator and regular operands.
 * Its form is like the following.
 * {
 *   $set: { [docPath: string]: any },
 *   $inc: { [docPath: string]: number },
 *   ...
 * }
 */
type RegularUpdateOperationMap = {
  [K in keyof RegularUpdateValueMap]: RegularUpdateOperand<K>
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
type UpdateOperationMap = {
  [K in keyof RegularUpdateValueMap]: UpdateOperand<K>
};

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
const allUpdateOperatorMap: { [K in keyof UpdateOperationMap]: 1 } = {
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
  $append: 1,
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

export type NonBreakingUpdateOperationOrSetOperand =
  | NonBreakingUpdateOperation
  | UpdateOperand<"$set">;

export type UpdateOperationOrSetOperand =
  | GeneralUpdateOperation
  | UpdateOperand<"$set">;

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
