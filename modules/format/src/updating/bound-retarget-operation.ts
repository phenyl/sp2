import { BoundDocumentPath, NestedValue } from "../common/bound-document-path";
import {
  BoundGeneralUpdateOperation,
  BoundNonBreakingUpdateOperation,
} from "./bound-create-update-operation";

import { retargetOperation } from "./retarget-operation";

export function $retarget<T extends Object>(): BoundRetarget<T> {
  // @ts-ignore surpress for typing.
  return retargetOperation;
}

export interface BoundRetarget<T extends Object> {
  <
    U extends NestedValue<T, K1, K2, K3, K4, K5, K6, K7, K8>,
    K1,
    K2,
    K3,
    K4,
    K5,
    K6,
    K7,
    K8
  >(
    docPath: BoundDocumentPath<T, K1, K2, K3, K4, K5, K6, K7, K8>,
    operation: BoundNonBreakingUpdateOperation<U>
  ): BoundNonBreakingUpdateOperation<T>;

  <
    U extends NestedValue<T, K1, K2, K3, K4, K5, K6, K7, K8>,
    K1,
    K2,
    K3,
    K4,
    K5,
    K6,
    K7,
    K8
  >(
    docPath: BoundDocumentPath<T, K1, K2, K3, K4, K5, K6, K7, K8>,
    operation: BoundGeneralUpdateOperation<U>
  ): BoundGeneralUpdateOperation<T>;
}
