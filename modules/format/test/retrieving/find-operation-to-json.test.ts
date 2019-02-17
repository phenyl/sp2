/* eslint-env mocha */
import {
  findOperationToJSON,
  queryConditionToJSON,
} from "../../src/retrieving/find-operation-to-json";

import assert from "assert";

describe("findOperationToJSON", () => {
  it("converts RegExp instance to plain object", () => {
    const findOperation = {
      $or: [
        {
          "foo.bar": { $regex: /(Diamond|Clover|Spade|Heart)([2-9JQKA]|10)+/ },
        },
        { "foo.bar": { $eq: "JOKER" } },
      ],
    };

    const converted = findOperationToJSON(findOperation);
    assert.deepStrictEqual(converted, {
      $or: [
        {
          "foo.bar": {
            $regex: "(Diamond|Clover|Spade|Heart)([2-9JQKA]|10)+",
          },
        },
        { "foo.bar": { $eq: "JOKER" } },
      ],
    });
  });
});

describe("queryConditionToJSON", () => {
  it("converts RegExp instance to plain object", () => {
    const queryCondition = {
      $regex: /(Diamond|Clover|Spade|Heart)([2-9JQKA]|10)+/g,
    };

    const converted = queryConditionToJSON(queryCondition);
    assert.deepStrictEqual(converted, {
      $regex: "(Diamond|Clover|Spade|Heart)([2-9JQKA]|10)+",
      $options: "g",
    });
  });
});
