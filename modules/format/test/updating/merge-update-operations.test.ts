/* eslint-env mocha */
import assert from "assert";
import { mergeUpdateOperations } from "../../src/updating/merge-update-operations";

describe("mergeUpdateOperations", () => {
  it("merges operations after normalization", () => {
    const op1 = { "name.first": "John" };
    const op2 = { $set: { age: 32 } };
    const op3 = { $push: { hobby: "tennis" } };
    const op4 = { $unset: { "name.middle": "" } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3, op4);
    assert.deepStrictEqual(mergedOperation, {
      $set: {
        "name.first": "John",
        age: 32,
      },
      $push: {
        hobby: { $each: ["tennis"] },
      },
      $unset: {
        "name.middle": "",
      },
    });
  });
  it("merges push operations deeply", () => {
    const op1 = { $push: { hobby: "tennis" } };
    const op2 = { $push: { hobby: "jogging" } };
    const mergedOperation = mergeUpdateOperations(op1, op2);
    assert.deepStrictEqual(mergedOperation, {
      $push: {
        hobby: { $each: ["tennis", "jogging"] },
      },
    });
  });
  it("merges objects to be set deeply", () => {
    const op1 = { name: { first: "John" } };
    const op2 = { name: { last: "Doe" } };
    const mergedOperation = mergeUpdateOperations(op1, op2);
    assert.deepStrictEqual(mergedOperation, {
      $set: {
        name: { first: "John", last: "Doe" },
      },
    });
  });
});
