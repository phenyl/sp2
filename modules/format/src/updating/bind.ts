import { BoundDocumentPathCreator } from "../common/bound-document-path";
import { BoundRetarget } from "./bound-retarget-operation";
import { UpdateOperationCreator } from "./bound-create-update-operation";
import { UpdateOperator } from "./update-operation";
import { createDocumentPath } from "../common/document-path";
import { retargetOperation } from "./retarget-operation";
import { updateOpearationCreator } from "./create-update-operation";

const updateOperationCreatorAndDocumentPathCreatorAndRetargetFunction = Object.assign(
  {},
  updateOpearationCreator,
  {
    $docPath: createDocumentPath,
    $retarget: retargetOperation,
  }
);

export function $bind<T>(): {
  [OP in UpdateOperator]: UpdateOperationCreator<OP, T>
} & {
  $docPath: BoundDocumentPathCreator<T>;
  $retarget: BoundRetarget<T>;
} {
  // @ts-ignore surpress for typing.
  return updateOperationCreatorAndDocumentPathCreatorAndRetargetFunction;
}
