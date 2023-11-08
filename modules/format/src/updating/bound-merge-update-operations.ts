import { DefaultDocumentType } from "../common/default-document-type";
import {
  BoundGeneralUpdateOperation,
  BoundNonBreakingUpdateOperation,
} from "./bound-create-update-operation";

import { mergeUpdateOperations } from "./merge-update-operations";

export function $merge<T = DefaultDocumentType>(): BoundMergeOperations<T> {
  // @ts-ignore surpress for typing.
  return mergeUpdateOperations;
}

export interface BoundMergeOperations<T = DefaultDocumentType> {
  (
    ...operationList: BoundNonBreakingUpdateOperation<T>[]
  ): BoundNonBreakingUpdateOperation<T>;

  (
    ...operationList: BoundGeneralUpdateOperation<T>[]
  ): BoundGeneralUpdateOperation<T>;
}
