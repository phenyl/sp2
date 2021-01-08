import {
  DocumentPath,
  GeneralRegularUpdateOperation,
  NonBreakingUpdateOperationOrSetOperand,
  RegularUpdateOperand,
  UpdateOperationOrSetOperand,
  UpdateOperator,
  createDocumentPath,
  getNestedValue,
  normalizeUpdateOperation,
  parseDocumentPath,
  reduceUpdateOperand,
  reduceUpdateOperation,
  retargetOperation,
  sortByNotation,
} from "@sp2/format";

import { classifyByComplexFindOperation } from "@sp2/retriever";
import deepEqual from "fast-deep-equal";
import { getObjectsToBeAssigned } from "./get-objects-to-be-assigned";

export interface UpdateFunction {
  <T extends Object>(
    obj: T,
    ...uOps: NonBreakingUpdateOperationOrSetOperand[]
  ): T;
  <Treturn extends Object, Targ extends Object = Treturn>(
    obj: Targ,
    ...uOps: NonBreakingUpdateOperationOrSetOperand[]
  ): Treturn;
  (obj: Object, ...uOps: UpdateOperationOrSetOperand[]): Object;
}

/**
 * Get a new object (different address from the input) updated from a given object by operations.
 */
export const update: UpdateFunction = (
  obj: Object,
  ...uOps: UpdateOperationOrSetOperand[]
) => {
  return uOps.reduce((ret, operation) => {
    return updateByOperation(ret, normalizeUpdateOperation(operation));
  }, obj);
};

export interface UpdatePropFunction {
  <Targ extends Object>(
    obj: Targ,
    docPath: DocumentPath,
    uOp: NonBreakingUpdateOperationOrSetOperand
  ): Targ;
  <Treturn extends Object, Targ extends Object = Treturn>(
    obj: Targ,
    docPath: DocumentPath,
    uOp: NonBreakingUpdateOperationOrSetOperand
  ): Treturn;
  (
    obj: Object,
    docPath: DocumentPath,
    uOp: UpdateOperationOrSetOperand
  ): Object;
}

/**
 * Get a new object (different address from the input) updated from a given object's property by operations.
 */
export const updateProp: UpdatePropFunction = (
  obj: Object,
  docPath: DocumentPath,
  uOp: UpdateOperationOrSetOperand
): Object => {
  const modifiedOps = retargetOperation(docPath, uOp);
  return update(obj, modifiedOps);
};

/**
 * Get a new instance (different address from the input) updated from a given instance by operations.
 */
export function updateAndRestore<T extends Object>(
  obj: T,
  uOp: UpdateOperationOrSetOperand
): T {
  const updatedObj = update(obj, uOp);
  const Constructor = obj.constructor;
  // @ts-ignore Constructor is valid.
  return new Constructor(updatedObj);
}

/**
 * Get a new instance (different address from the input) updated from a given instance's property by operations.
 */
export function updatePropAndRestore<T extends Object>(
  obj: T,
  docPath: DocumentPath,
  uOp: UpdateOperationOrSetOperand
): T {
  const updatedObj = updateProp(obj, docPath, uOp);
  const Constructor = obj.constructor;
  // @ts-ignore Constructor is valid.
  return new Constructor(updatedObj);
}

/**
 * Update a given object by one normalized operation.
 */
function updateByOperation(
  obj: Object,
  uOp: GeneralRegularUpdateOperation
): Object {
  let updatedObj = reduceUpdateOperation(
    uOp,
    (acc, operator, operand) => {
      return updateByOperator(acc, operator, operand);
    },
    obj
  );

  if (uOp.$restore != null) {
    updatedObj = Updater.$restore(obj, updatedObj, uOp.$restore);
  }
  return updatedObj;
}

/**
 * Update a given object by one set of operator and operand
 */
function updateByOperator<OP extends UpdateOperator>(
  obj: Object,
  operator: OP,
  operand: RegularUpdateOperand<OP>
): Object {
  switch (operator) {
    case "$set":
      return Updater.$set(obj, <RegularUpdateOperand<"$set">>operand);
    case "$inc":
      return Updater.$inc(obj, <RegularUpdateOperand<"$inc">>operand);
    case "$min":
      return Updater.$min(obj, <RegularUpdateOperand<"$min">>operand);
    case "$max":
      return Updater.$max(obj, <RegularUpdateOperand<"$max">>operand);
    case "$mul":
      return Updater.$mul(obj, <RegularUpdateOperand<"$mul">>operand);
    case "$addToSet":
      return Updater.$addToSet(obj, <RegularUpdateOperand<"$addToSet">>operand);
    case "$pop":
      return Updater.$pop(obj, <RegularUpdateOperand<"$pop">>operand);
    case "$pull":
      return Updater.$pull(obj, <RegularUpdateOperand<"$pull">>operand);
    case "$pullAll":
      return Updater.$pullAll(obj, <RegularUpdateOperand<"$pullAll">>operand);
    case "$push":
      return Updater.$push(obj, <RegularUpdateOperand<"$push">>operand);
    case "$currentDate":
      return Updater.$currentDate(
        obj,
        <RegularUpdateOperand<"$currentDate">>operand
      );
    case "$bit":
      return Updater.$bit(obj, <RegularUpdateOperand<"$bit">>operand);
    case "$unset":
      return Updater.$unset(obj, <RegularUpdateOperand<"$unset">>operand);
    case "$rename":
      return Updater.$rename(obj, <RegularUpdateOperand<"$rename">>operand);
    case "$append":
      return Updater.$append(obj, <RegularUpdateOperand<"$append">>operand);
  }
  return obj;
}

/**
 * Shallow-copy a given object and set a value to its property at docPath.
 */
function setValue<T extends Object>(
  obj: T,
  docPath: DocumentPath,
  value: any
): T {
  const revObjsToBeAssigned = getObjectsToBeAssigned(obj, docPath).reverse();
  const revKeys = parseDocumentPath(docPath).reverse();
  // assert(revObjsToBeAssigned.length === revKeys.length)
  // assert(revObjsToBeAssigned.length >= 1)

  // @ts-ignore revObjsToBeAssigned[0] always exists.
  const originalValue = revObjsToBeAssigned[0][revKeys[0]];
  if (deepEqual(originalValue, value)) {
    return obj;
  }

  return revKeys.reduce((newValue, key, i) => {
    const objToBeAssigned = revObjsToBeAssigned[i];
    if (typeof key === "number" && Array.isArray(objToBeAssigned)) {
      const shallowCopied = objToBeAssigned.slice();
      shallowCopied[key] = newValue;
      return shallowCopied;
    }
    return Object.assign({}, objToBeAssigned, { [key]: newValue });
  }, value);
}

/**
 *
 */
class Updater {
  /**
   *
   */
  static $set<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$set">
  ): T {
    return reduceUpdateOperand<T, "$set">(
      operand,
      (updatedObj, docPath, value) => {
        return setValue(updatedObj, docPath, value);
      },
      obj
    );
  }

  /**
   *
   */
  static $inc<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$inc">
  ): T {
    const setOperand = reduceUpdateOperand<
      RegularUpdateOperand<"$set">,
      "$inc"
    >(
      operand,
      (valuesToSet, docPath, value) => {
        const currentVal = getNestedValue(obj, docPath) || 0;
        return { [docPath]: currentVal + value, ...valuesToSet };
      },
      {}
    );
    return this.$set(obj, setOperand);
  }

  /**
   *
   */
  static $min<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$min">
  ): T {
    const setOperand = reduceUpdateOperand<
      RegularUpdateOperand<"$set">,
      "$min"
    >(
      operand,
      (valuesToSet, docPath, value) => {
        const currentVal = getNestedValue(obj, docPath);
        if (currentVal == null || value < currentVal) {
          return { [docPath]: value, ...valuesToSet };
        }
        return valuesToSet;
      },
      {}
    );
    return this.$set(obj, setOperand);
  }

  /**
   *
   */
  static $max<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$max">
  ): T {
    const setOperand = reduceUpdateOperand<
      RegularUpdateOperand<"$set">,
      "$max"
    >(
      operand,
      (valuesToSet, docPath, value) => {
        const currentVal = getNestedValue(obj, docPath);
        if (currentVal == null || value > currentVal) {
          return { [docPath]: value, ...valuesToSet };
        }
        return valuesToSet;
      },
      {}
    );
    return this.$set(obj, setOperand);
  }

  /**
   *
   */
  static $mul<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$mul">
  ): T {
    const setOperand = reduceUpdateOperand<
      RegularUpdateOperand<"$set">,
      "$mul"
    >(
      operand,
      (valuesToSet, docPath, value) => {
        const currentVal = getNestedValue(obj, docPath) || 0;
        return { [docPath]: currentVal * value, ...valuesToSet };
      },
      {}
    );
    return this.$set(obj, setOperand);
  }

  /**
   *
   */
  static $addToSet<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$addToSet">
  ): T {
    const setOperand = reduceUpdateOperand<
      RegularUpdateOperand<"$set">,
      "$addToSet"
    >(
      operand,
      (valuesToSet, docPath, value) => {
        let arr = prepareArrayFromOperand(obj, docPath, "$addToSet");
        const newArr = value.$each.filter(
          (element: any) => !arr.some((arrEl: any) => deepEqual(arrEl, element))
        );
        return { [docPath]: arr.concat(newArr), ...valuesToSet };
      },
      {}
    );
    return this.$set(obj, setOperand);
  }
  /**
   *
   */
  static $pop<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$pop">
  ): T {
    const setOperand = reduceUpdateOperand<
      RegularUpdateOperand<"$set">,
      "$pop"
    >(
      operand,
      (valuesToSet, docPath, value) => {
        let arr = prepareArrayFromOperand(obj, docPath, "$pop");
        value === 1 ? arr.pop() : arr.shift();
        return { [docPath]: arr, ...valuesToSet };
      },
      {}
    );
    return this.$set(obj, setOperand);
  }

  /**
   *
   */
  static $pull<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$pull">
  ): T {
    const setOperand = reduceUpdateOperand<
      RegularUpdateOperand<"$set">,
      "$pull"
    >(
      operand,
      (valuesToSet, docPath, complexFindOperation) => {
        let arr = prepareArrayFromOperand(obj, docPath, "$pull");
        const classified = classifyByComplexFindOperation(
          arr,
          complexFindOperation
        );
        return { [docPath]: classified.ng, ...valuesToSet };
      },
      {}
    );
    return this.$set(obj, setOperand);
  }

  /**
   *
   */
  static $pullAll<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$pullAll">
  ): T {
    const setOperand = reduceUpdateOperand<
      RegularUpdateOperand<"$set">,
      "$pullAll"
    >(
      operand,
      (valuesToSet, docPath, valuesToPull) => {
        let arr = prepareArrayFromOperand(obj, docPath, "$pullAll");
        arr = arr.filter(
          (val) => !valuesToPull.some((arrEl) => deepEqual(arrEl, val))
        );
        return { [docPath]: arr, ...valuesToSet };
      },
      {}
    );
    return this.$set(obj, setOperand);
  }

  /**
   *
   */
  static $push<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$push">
  ): T {
    const setOperand = reduceUpdateOperand<
      RegularUpdateOperand<"$set">,
      "$push"
    >(
      operand,
      (valuesToSet, docPath, modifier) => {
        let arr = prepareArrayFromOperand(obj, docPath, "$push");
        let position =
          modifier.$position != null ? modifier.$position : arr.length;
        let newArr = arr.slice();
        newArr.splice(position, 0, ...modifier.$each);
        if (modifier.$sort != null) {
          newArr = sortByNotation(newArr, modifier.$sort);
        }
        if (modifier.$slice != null) {
          newArr =
            modifier.$slice >= 0
              ? newArr.slice(0, modifier.$slice)
              : newArr.slice(modifier.$slice);
        }
        return { [docPath]: newArr, ...valuesToSet };
      },
      {}
    );
    return this.$set(obj, setOperand);
  }

  /**
   *
   */
  static $currentDate<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$currentDate">
  ): T {
    const setOperand = reduceUpdateOperand<
      RegularUpdateOperand<"$set">,
      "$currentDate"
    >(
      operand,
      (valuesToSet, docPath, typeSpecification) => {
        if (typeSpecification === true) {
          typeSpecification = { $type: "date" };
        }
        const now = new Date();
        const time = typeSpecification.$type === "date" ? now : now.getTime();
        return { [docPath]: time, ...valuesToSet };
      },
      {}
    );
    return this.$set(obj, setOperand);
  }

  /**
   *
   */
  static $bit<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$bit">
  ): T {
    const setOperand = reduceUpdateOperand<
      RegularUpdateOperand<"$set">,
      "$bit"
    >(
      operand,
      (valuesToSet, docPath, bit) => {
        const currentNum = getNestedValue(obj, docPath) || 0;
        if (bit.and != null) {
          return { [docPath]: currentNum & bit.and, ...valuesToSet };
        }
        if (bit.or != null) {
          return { [docPath]: currentNum | bit.or, ...valuesToSet };
        }
        if (bit.xor != null) {
          return { [docPath]: currentNum ^ bit.xor, ...valuesToSet };
        }
        return valuesToSet;
      },
      {}
    );
    return this.$set(obj, setOperand);
  }

  /**
   * Unset the value of the given DocumentPaths.
   * NOTICE: The objects whose property are deleted will be converted into a plain object.
   */
  static $unset(obj: Object, operand: RegularUpdateOperand<"$unset">): Object {
    return reduceUpdateOperand<Object, "$unset">(
      operand,
      (newObj, docPath) => {
        const attrs = parseDocumentPath(docPath);
        const lastAttr = attrs.pop();
        const pathToLast = createDocumentPath(...attrs);
        const lastObj = pathToLast
          ? getNestedValue(newObj, pathToLast)
          : newObj;

        let copiedLastObj: any[] | Object;
        if (Array.isArray(lastObj)) {
          copiedLastObj = lastObj.slice();
          // @ts-ignore non-null access.
          copiedLastObj[lastAttr] = undefined;
        } else if (lastObj != null) {
          copiedLastObj = Object.assign({}, lastObj);
          // @ts-ignore non-null access.
          delete copiedLastObj[lastAttr];
        } else {
          return obj;
        }

        return pathToLast
          ? this.$set(newObj, { [pathToLast]: copiedLastObj })
          : copiedLastObj;
      },
      obj
    );
  }

  /**
   * Unset the value of the given DocumentPaths.
   * NOTICE: The objects whose property are renamed will be converted into a plain object.
   */
  static $rename(
    obj: Object,
    operand: RegularUpdateOperand<"$rename">
  ): Object {
    return reduceUpdateOperand<Object, "$rename">(
      operand,
      (newObj, docPath, newAttr) => {
        const attrs = parseDocumentPath(docPath);
        const lastAttr = attrs.pop();
        const pathToLast = createDocumentPath(...attrs);
        const lastObj = pathToLast
          ? getNestedValue(newObj, pathToLast)
          : newObj;

        if (Array.isArray(lastObj)) {
          throw Error(
            `$rename operation cannot be applied to element in array: "${docPath}".`
          );
        }

        if (lastObj == null || lastAttr == null || !(lastAttr in lastObj)) {
          return newObj;
        }

        const copiedLastObj = Object.assign({}, lastObj);
        // @ts-ignore non-null access.
        delete copiedLastObj[lastAttr];

        // @ts-ignore non-null access.
        copiedLastObj[newAttr] = lastObj[lastAttr];

        return pathToLast
          ? this.$set(newObj, { [pathToLast]: copiedLastObj })
          : copiedLastObj;
      },
      obj
    );
  }

  /**
   *
   */
  static $restore(
    originalObj: Object,
    targetObj: Object,
    operand: RegularUpdateOperand<"$restore">
  ): Object {
    const setOperand = reduceUpdateOperand<Object, "$restore">(
      operand,
      (valuesToSet, docPath, _Constructor) => {
        const currentValue = getNestedValue(targetObj, docPath);
        if (isPrimitive(currentValue)) {
          return valuesToSet;
        }
        const Constructor: (new (obj: Object) => unknown) | null =
          typeof _Constructor === "function"
            ? _Constructor
            : getNestedConstructor(originalObj, docPath);
        return {
          [docPath]: new Constructor(currentValue),
          ...valuesToSet,
        };
      },
      {}
    );
    return this.$set(targetObj, setOperand);
  }

  /**
   *
   */
  static $append<T extends Object>(
    obj: T,
    operand: RegularUpdateOperand<"$append">
  ): T {
    const setOperand = reduceUpdateOperand<
      RegularUpdateOperand<"$set">,
      "$append"
    >(
      operand,
      (valuesToSet, docPath, value) => {
        const currentVal = getNestedValue(obj, docPath);
        if (currentVal == null || typeof currentVal !== "object") {
          return { [docPath]: value, ...valuesToSet };
        }
        if (Array.isArray(currentVal)) {
          throw new Error(
            `"$append" operator cannot be applied to an array. DocumentPath: "${docPath}".`
          );
        }
        return {
          [docPath]: Object.assign({}, currentVal, value),
          ...valuesToSet,
        };
      },
      {}
    );
    return this.$set(obj, setOperand);
  }
}

function getNestedConstructor(
  originalObj: Object,
  docPath: string
): new (obj: Object) => unknown {
  const nestedValue = getNestedValue(originalObj, docPath);
  return nestedValue.constructor;
}

function prepareArrayFromOperand<T extends Object>(
  obj: T,
  docPath: string,
  operator: UpdateOperator
) {
  let arr = getNestedValue(obj, docPath);
  if (arr == null) {
    arr = []; // If the field is absent, empty array is set.
  }
  if (!Array.isArray(arr)) {
    throw new Error(
      `"${operator}" operator must be applied to an array. DocumentPath: "${docPath}".`
    );
  }
  return arr;
}

function isPrimitive(value: any): boolean {
  const t = typeof value;
  return value == null || (t != "object" && t != "function");
}
