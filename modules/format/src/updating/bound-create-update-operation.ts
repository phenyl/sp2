import { BoundDocumentPath, NestedValue } from "../common/bound-document-path";
import {
  GeneralUpdateOperation,
  NonBreakingOperator,
  NonBreakingUpdateOperation,
  RegularPushUpdateValue,
  RegularUpdateValue,
  UpdateOperator,
} from "./update-operation";

import { updateOpearationCreator } from "./create-update-operation";

export function $op<T>(): {
  [OP in UpdateOperator]: UpdateOperationCreator<OP, T>
} {
  // @ts-ignore surpress for typing.
  return updateOpearationCreator;
}

type BoundUpdateOperation<T, OP> = (OP extends NonBreakingOperator
  ? NonBreakingUpdateOperation
  : GeneralUpdateOperation) & {
  $__META__: { target: T };
};

export type BoundGeneralUpdateOperation<T> = GeneralUpdateOperation & {
  $__META__: { target: T };
};

export type BoundNonBreakingUpdateOperation<T> = NonBreakingUpdateOperation & {
  $__META__: { target: T };
};

type BoundUpdateOperandItemValue<V, ItemVal> = {
  $set: V; // V extends ItemVal()=any) ? V : never;
  $inc: V extends ItemVal ? V : never;
  $max: V extends ItemVal ? V : never;
  $min: V extends ItemVal ? V : never;
  $mul: V extends ItemVal ? V : never;
  $addToSet: V extends (infer U)[] ? U | { $each: U[] } : never;
  $pop: V extends any[] ? ItemVal : never;
  $pull: V extends any[] ? ItemVal : never;
  $push: V extends (infer U)[] ? (U | RegularPushUpdateValue<U>) : never;
  $currentDate: V extends (string | Date | number) ? ItemVal : never;
  $bit: V extends number ? ItemVal : never;
  $unset: ItemVal;
  $restore: V extends Object ? ItemVal : never;
  $rename: ItemVal;
};

type ValueOf<OP extends UpdateOperator, V> = BoundUpdateOperandItemValue<
  V,
  RegularUpdateValue<OP>
>[OP];

// prettier-ignore
export interface UpdateOperationCreator<OP extends UpdateOperator, T> {
  <KA1, KA2, KA3, KA4, KA5, KA6, KA7, KA8, KA9, KA10>(
    docPath: BoundDocumentPath<
      T,
      KA1, KA2, KA3, KA4, KA5, KA6, KA7, KA8, KA9, KA10
    >,
    value: ValueOf<
      OP,
      NestedValue<T, KA1, KA2, KA3, KA4, KA5, KA6, KA7, KA8, KA9, KA10>
    >
  ): BoundUpdateOperation<T, OP>;
}
