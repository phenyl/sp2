/* eslint-env mocha */
import assert from "assert";
import { createUpdateOperation } from "../../src/updating/create-update-operation";

describe("createUpdateOperation", () => {
  it("returns UpdateOperation", () => {
    const operation = createUpdateOperation("$set", "foo.bar[1].name", "John");
    assert.deepStrictEqual(operation, {
      $set: {
        "foo.bar[1].name": "John",
      },
    });
  });
  it("returns UpdateOperation with multiple documentPath", () => {
    const operation = createUpdateOperation(
      "$set",
      ["foo.bar[1].name", "John"],
      ["foo.bar[1].age", 32]
    );
    assert.deepStrictEqual(operation, {
      $set: {
        "foo.bar[1].name": "John",
        "foo.bar[1].age": 32,
      },
    });
  });
});
