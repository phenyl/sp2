import { BoundDocumentPath, NestedValue } from "../common/bound-document-path";
import {
  GeneralUpdateOperation,
  NonBreakingOperator,
  NonBreakingUpdateOperation,
  RegularPushUpdateValue,
  UpdateOperator,
  UpdateValue,
} from "./update-operation";

import { updateOpearationCreator } from "./create-update-operation";

export function $update<T>(): {
  [OP in UpdateOperator]: UpdateOperationCreator<OP, T>
} {
  // @ts-ignore surpress for typing.
  return updateOpearationCreator;
}

export type BoundUpdateOperation<T, OP> = (OP extends NonBreakingOperator
  ? NonBreakingUpdateOperation
  : GeneralUpdateOperation) & {
  __META__: { target: T };
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
  UpdateValue<OP>
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
  <
    KA1, KA2, KA3, KA4, KA5, KA6, KA7, KA8, KA9, KA10,
    KB1, KB2, KB3, KB4, KB5, KB6, KB7, KB8, KB9, KB10,
    KC1, KC2, KC3, KC4, KC5, KC6, KC7, KC8, KC9, KC10,
    KD1, KD2, KD3, KD4, KD5, KD6, KD7, KD8, KD9, KD10,
    KE1, KE2, KE3, KE4, KE5, KE6, KE7, KE8, KE9, KE10,
    KF1, KF2, KF3, KF4, KF5, KF6, KF7, KF8, KF9, KF10
  >(
    keyValueA: [
      BoundDocumentPath<T, KA1, KA2, KA3, KA4, KA5, KA6, KA7, KA8, KA9, KA10>,
      ValueOf<
        OP,
        NestedValue<T, KA1, KA2, KA3, KA4, KA5, KA6, KA7, KA8, KA9, KA10>
      >
    ],
    keyValueB?: [
      BoundDocumentPath<T, KB1, KB2, KB3, KB4, KB5, KB6, KB7, KB8, KB9, KB10>,
      ValueOf<
        OP,
        NestedValue<T, KB1, KB2, KB3, KB4, KB5, KB6, KB7, KB8, KB9, KB10>
      >
    ],
    keyValueC?: [
      BoundDocumentPath<T, KC1, KC2, KC3, KC4, KC5, KC6, KC7, KC8, KC9, KC10>,
      ValueOf<
        OP,
        NestedValue<T, KC1, KC2, KC3, KC4, KC5, KC6, KC7, KC8, KC9, KC10>
      >
    ],
    keyValueD?: [
      BoundDocumentPath<T, KD1, KD2, KD3, KD4, KD5, KD6, KD7, KD8, KD9, KD10>,
      ValueOf<
        OP,
        NestedValue<T, KD1, KD2, KD3, KD4, KD5, KD6, KD7, KD8, KD9, KD10>
      >
    ],
    keyValueE?: [
      BoundDocumentPath<T, KE1, KE2, KE3, KE4, KE5, KE6, KE7, KE8, KE9, KE10>,
      ValueOf<
        OP,
        NestedValue<T, KE1, KE2, KE3, KE4, KE5, KE6, KE7, KE8, KE9, KE10>
      >
    ],
    keyValueF?: [
      BoundDocumentPath<T, KF1, KF2, KF3, KF4, KF5, KF6, KF7, KF8, KF9, KF10>,
      ValueOf<
        OP,
        NestedValue<T, KF1, KF2, KF3, KF4, KF5, KF6, KF7, KF8, KF9, KF10>
      >
    ]
  ): BoundUpdateOperation<T, OP>;
}
