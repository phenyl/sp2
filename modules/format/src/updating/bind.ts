import { BoundDocumentPathCreator } from "../common/bound-document-path";
import { UpdateOperationCreator } from "./bound-create-update-operation";
import { UpdateOperator } from "./update-operation";
import { createDocumentPath } from "../common/document-path";
import { updateOpearationCreator } from "./create-update-operation";

const updateOperationCreatorAndDocumentPathCreator = Object.assign(
  {},
  updateOpearationCreator,
  {
    $docPath: createDocumentPath,
  }
);

export function $bind<T>(): {
  [OP in UpdateOperator]: UpdateOperationCreator<OP, T>
} & {
  $docPath: BoundDocumentPathCreator<T>;
} {
  // @ts-ignore surpress for typing.
  return updateOperationCreatorAndDocumentPathCreator;
}
