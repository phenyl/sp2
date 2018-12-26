/* eslint-env mocha */
import {
  retargetAndRestore,
  retargetOperation,
} from "../../src/updating/retarget-operation";

import assert from "assert";

describe("retargetOperation", () => {
  it("retargets the given UpdateOperation to the given docPath", () => {
    const retargetedOperation = retargetOperation("name", {
      $set: { first: "John" },
    });
    assert.deepStrictEqual(retargetedOperation, {
      $set: {
        "name.first": "John",
      },
    });
  });
  it("retargets the given UpdateOperation to the given docPath after normalization", () => {
    const retargetedOperation = retargetOperation("name", { first: "John" });
    assert.deepStrictEqual(retargetedOperation, {
      $set: {
        "name.first": "John",
      },
    });
  });
});

describe("retargetAndRestore", () => {
  it("retargets the given UpdateOperation to the given docPath and add $restore operator to the path", () => {
    const retargetedOperation = retargetAndRestore("name", {
      $set: { first: "John" },
    });
    assert.deepStrictEqual(retargetedOperation, {
      $set: {
        "name.first": "John",
      },
      $restore: { name: "" },
    });
  });
});
