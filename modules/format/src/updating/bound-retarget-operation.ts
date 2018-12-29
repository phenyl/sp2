import { BoundDocumentPath, NestedValue } from "../common/bound-document-path";

import { BoundUpdateOperation } from "./bound-create-update-operation";
import { retargetOperation } from "./retarget-operation";

export function $retarget<T>(): BoundRetarget<T> {
  // @ts-ignore surpress for typing.
  return retargetOperation;
}

export interface BoundRetarget<T> {
  <
    U extends NestedValue<T, K1, K2, K3, K4, K5, K6, K7, K8, K9, K10>,
    K1,
    K2,
    K3,
    K4,
    K5,
    K6,
    K7,
    K8,
    K9,
    K10
  >(
    docPath: BoundDocumentPath<T, K1, K2, K3, K4, K5, K6, K7, K8, K9, K10>,
    operation: BoundUpdateOperation<U>
  ): BoundUpdateOperation<T>;
}
