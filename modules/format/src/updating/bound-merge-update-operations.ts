import {
  BoundGeneralUpdateOperation,
  BoundNonBreakingUpdateOperation,
} from "./bound-create-update-operation";

import { mergeUpdateOperations } from "./merge-update-operations";

export function $merge<T>(): BoundMergeOperations<T> {
  // @ts-ignore surpress for typing.
  return mergeUpdateOperations;
}

export interface BoundMergeOperations<T> {
  (
    ...operationList: BoundNonBreakingUpdateOperation<T>[]
  ): BoundNonBreakingUpdateOperation<T>;

  (
    ...operationList: BoundGeneralUpdateOperation<T>[]
  ): BoundGeneralUpdateOperation<T>;
}
