/* eslint-env mocha */
import {
  reduceUpdateOperand,
  reduceUpdateOperation,
} from "../../src/updating/reduce-update-operation";

import assert from "assert";

describe("reduceUpdateOperand", () => {
  it("reduces operands for each docPath and value", () => {
    const operand = { "name.first": "John", "name.last": "Doe" };
    const total = reduceUpdateOperand(
      operand,
      (acc, docPath, value, index) => {
        return `${acc} ${docPath} ${value} ${index}`.trim();
      },
      ""
    );
    assert.equal(total, "name.first John 0 name.last Doe 1");
  });
});

describe("reduceUpdateOperation", () => {
  it("reduces operations for each operator after normalization", () => {
    const operation = { $set: { name: "John" }, $push: { hobbies: "tennis" } };
    const total = reduceUpdateOperation(
      operation,
      (acc, operator, operand, index) => {
        const firstKey = Object.keys(operand)[0];
        const firstValue = operand[firstKey];
        return `${acc} ${operator} ${firstKey} ${typeof firstValue} ${index}`.trim();
      },
      ""
    );
    assert.equal(total, "$set name string 0 $push hobbies object 1");
  });
});
