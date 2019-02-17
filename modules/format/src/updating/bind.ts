import { BoundDocumentPathCreator } from "../common/bound-document-path";
import { BoundMergeOperations } from "./bound-merge-update-operations";
import { BoundRetarget } from "./bound-retarget-operation";
import { UpdateOperationCreator } from "./bound-create-update-operation";
import { UpdateOperator } from "./update-operation";
import { createDocumentPath } from "../common/document-path";
import { mergeUpdateOperations } from "./merge-update-operations";
import { retargetOperation } from "./retarget-operation";
import { updateOpearationCreator } from "./bound-create-update-operation";

const updateOperationCreatorAndDocumentPathCreatorAndRetargetFunctionAndMergeFunction = Object.assign(
  {},
  updateOpearationCreator,
  {
    $docPath: createDocumentPath,
    $merge: mergeUpdateOperations,
    $path: createDocumentPath,
    $retarget: retargetOperation,
  }
);

export function $bind<T>(): {
  [OP in UpdateOperator]: UpdateOperationCreator<OP, T>
} & {
  $docPath: BoundDocumentPathCreator<T>;
  $merge: BoundMergeOperations<T>;
  $path: BoundDocumentPathCreator<T>;
  $retarget: BoundRetarget<T>;
} {
  // @ts-ignore surpress for typing.
  return updateOperationCreatorAndDocumentPathCreatorAndRetargetFunctionAndMergeFunction;
}
