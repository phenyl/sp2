import {
  GeneralRegularUpdateOperation,
  RegularUpdateOperand,
  UpdateOperationOrSetOperand,
  UpdateOperator,
  allUpdateOperators,
} from "./update-operation";

import { normalizeUpdateOperation } from "./normalize-update-operation";

export type UpdateOperationVisitor = {
  [OP in UpdateOperator]?: ((
    operand: RegularUpdateOperand<OP>
  ) => RegularUpdateOperand<OP>)
} & {
  operation?: <OP extends UpdateOperator>(
    operand: RegularUpdateOperand<OP>,
    operator: OP
  ) => RegularUpdateOperand<OP>;
};

/**
 * @public
 * Modify FindOperation by passing visitor functions.
 */
export function visitUpdateOperation(
  updateOperation: UpdateOperationOrSetOperand,
  visitor: UpdateOperationVisitor
): GeneralRegularUpdateOperation {
  return allUpdateOperators.reduce(
    (acc, operator: UpdateOperator) => visitOp(acc, visitor, operator),
    normalizeUpdateOperation(updateOperation)
  );
}

function visitOp<OP extends UpdateOperator>(
  updateOperation: GeneralRegularUpdateOperation,
  visitor: UpdateOperationVisitor,
  operator: OP
): GeneralRegularUpdateOperation {
  if (updateOperation[operator] == null) {
    return updateOperation;
  }

  let ret = Object.assign({}, updateOperation);
  const generalVisitor = visitor.operation;
  if (generalVisitor != null) {
    ret = Object.assign(ret, {
      // @ts-ignore ret[operator] must exists as it was copied from updateOperatino.
      [operator]: generalVisitor(ret[operator], operator),
    });
  }
  const specificVisitor: UpdateOperationVisitor[OP] = visitor[operator];
  if (specificVisitor != null) {
    const operand: GeneralRegularUpdateOperation[OP] = ret[operator];
    // @ts-ignore specificVisitor must be a compatible function.
    ret = Object.assign(ret, { [operator]: specificVisitor(operand) });
  }
  return ret;
}
