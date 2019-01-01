import {
  BoundGeneralUpdateOperation,
  BoundNonBreakingUpdateOperation,
} from "@sp2/format";

import { update } from "./updater";

export interface BoundUpdateFunction {
  <T extends Object>(obj: T, ...uOps: BoundNonBreakingUpdateOperation<T>[]): T;

  <Treturn extends Object, Targ extends Object = Treturn>(
    obj: Targ,
    ...uOps: BoundNonBreakingUpdateOperation<Treturn>[]
  ): Treturn;

  <Treturn extends Object = Object, Targ extends Object = Treturn>(
    obj: Targ,
    ...uOps: BoundGeneralUpdateOperation<Targ>[]
  ): Treturn;
}

export const $update: BoundUpdateFunction = update;
