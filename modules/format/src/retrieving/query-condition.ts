import { ComplexFindOperation } from "./find-operation";

type TextQueryCondition = {
  $search?: string;
  $language?: string;
  $caseSensitive?: boolean;
  $diacriticSensitive: boolean;
};

type JSONValue = string | number | boolean | JSONObject | JSONArray;

export interface JSONObject {
  [x: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> {}

export type EqCondition = JSONValue;

export type QueryCondition = Partial<WholeQueryCondition>;

export interface WholeComparisonQueryCondition {
  $eq: any;
  $gt: any;
  $gte: any;
  $in: any[];
  $lt: any;
  $lte: any;
  $ne: any;
  $nin: any[];
}

export interface WholeLogicalQueryCondition {
  $not: QueryCondition;
}

export interface WholeElementQueryCondition {
  $exists: boolean;
  $type: BSONTypeNumber | BSONTypeString;
}

export interface WholeEvaluationQueryCondition {
  // evaluation
  $mod: [number, number];
  $regex: RegExp | string;
  $options: string;
  $text: TextQueryCondition;
  $where: Function; // To Be Implemented
}

export interface WholeGeospatialQueryCondition {
  $geoIntersects: Object; // To Be Implemented
  $geoWithin: Object; // To Be Implemented
  $near: Object; // To Be Implemented
  $nearSphere: Object; // To Be Implemented
}

export interface WholeArrayQueryCondition {
  $all: Array<any>;
  $elemMatch: ComplexFindOperation;
  $size: number;
}

export interface WholeBitwiseQueryCondition {
  $bitsAllClear: number; // Currently, only number is allowed
  $bitsAllSet: number; // Currently, only number is allowed
  $bitsAnyClear: number; // Currently, only number is allowed
  $bitsAnySet: number; // Currently, only number is allowed
}

// $comment: No implementation
//export interface WholeCommentQueryCondition {}

export interface WholeQueryCondition
  extends WholeComparisonQueryCondition,
    WholeLogicalQueryCondition,
    WholeElementQueryCondition,
    WholeEvaluationQueryCondition,
    WholeGeospatialQueryCondition,
    WholeArrayQueryCondition,
    WholeBitwiseQueryCondition {}

export type ComparisonQueryOperator = keyof WholeComparisonQueryCondition;
export type LogicalQueryOperator = keyof WholeLogicalQueryCondition;
export type ElementQueryOperator = keyof WholeElementQueryCondition;
export type EvaluationQueryOperator = keyof WholeEvaluationQueryCondition;
export type GeospatialQueryOperator = keyof WholeGeospatialQueryCondition;
export type ArrayOperatorName = keyof WholeArrayQueryCondition;
export type BitwiseQueryOperator = keyof WholeBitwiseQueryCondition;

export type QueryOperator =
  | ComparisonQueryOperator
  | LogicalQueryOperator
  | ElementQueryOperator
  | EvaluationQueryOperator
  | GeospatialQueryOperator
  | ArrayOperatorName
  | BitwiseQueryOperator;

export type BSONTypeNumber =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | -1
  | 127;

export type BSONTypeString =
  | "double"
  | "string"
  | "object"
  | "array"
  | "binData"
  | "undefined"
  | "objectId"
  | "bool"
  | "date"
  | "null"
  | "regex"
  | "dbPointer"
  | "javascript"
  | "symbol"
  | "javascriptWithScope"
  | "int"
  | "timestamp"
  | "long"
  | "decimal"
  | "minKey"
  | "maxKey";

/**
 * get BSON Type of the given value as a string
 * @see https://docs.mongodb.com/manual/reference/operator/query/type/
 */
export function getBSONTypeString(val: any): BSONTypeString {
  switch (typeof val) {
    case "number":
      return val.toString().indexOf(".") >= 0 ? "double" : "int";

    case "string":
      return "string";

    case "boolean":
      return "bool";

    case "undefined":
      return "undefined";

    case "function":
      return "javascript";

    case "object":
    default:
      if (val instanceof Date) return "date";
      if (val instanceof RegExp) return "regex";
      if (Array.isArray(val)) return "array";
      return val ? "object" : "null";

    // TODO: confirm spec
  }
}

/**
 * get BSON Type of the given value as a number
 * @see https://docs.mongodb.com/manual/reference/operator/query/type/
 */
export function getBSONTypeNumber(val: any): BSONTypeNumber {
  const map: { [K in BSONTypeString]: BSONTypeNumber } = {
    double: 1,
    string: 2,
    object: 3,
    array: 4,
    binData: 5,
    undefined: 6,
    objectId: 7,
    bool: 8,
    date: 9,
    null: 10,
    regex: 11,
    dbPointer: 12,
    javascript: 13,
    symbol: 14,
    javascriptWithScope: 15,
    int: 16,
    timestamp: 17,
    long: 18,
    decimal: 19,
    minKey: -1,
    maxKey: 127,
  };
  return map[getBSONTypeString(val)];
}

export function isQueryCondition(
  val: ComplexFindOperation
): val is QueryCondition {
  if (val == null) return false;
  if (typeof val !== "object") return false;
  const firstKey = Object.keys(val)[0];
  if (!firstKey) return false;
  return firstKey.charAt(0) === "$";
}
