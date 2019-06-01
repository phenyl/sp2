/* eslint-env mocha */
import assert from "assert";
import { validateUpdateOperation } from "../../src/updating/validate-update-operation";

describe("validateUpdateOperation", () => {
  it("returns valid when an operation has no conflicting document paths", () => {
    const operation = {
      $set: { "foo.bar": 12, bar: { foo: "abc" }, "foo.biz": true },
      $push: { "foo.baz": "xyz" },
      $mul: { abc: 123 },
      $pull: { xyz: "foo" },
    };
    assert.deepEqual(validateUpdateOperation(operation), {
      valid: true,
      errors: [],
    });
  });

  it("returns invalid when an operation has the same simple document path in two different operators", () => {
    const operation = {
      $inc: { foo: 12 },
      $addToSet: { foo: "xyz" },
    };
    assert.deepEqual(validateUpdateOperation(operation), {
      valid: false,
      errors: [
        new Error("Updating the path 'foo' would create a conflict at 'foo'"),
      ],
    });
  });

  it("returns invalid when an operation has the same dotted document path in two different operators", () => {
    const operation = {
      $set: { "foo.bar": 12 },
      $push: { "foo.bar": "xyz" },
    };
    assert.deepEqual(validateUpdateOperation(operation), {
      valid: false,
      errors: [
        new Error(
          "Updating the path 'foo.bar' would create a conflict at 'foo.bar'"
        ),
      ],
    });
  });

  it("returns invalid when an operation has the same complex document path in two different operators", () => {
    const operation = {
      $set: { "foo.bar[1].baz": 12 },
      $push: { "foo.bar[1].baz": "xyz" },
    };
    assert.deepEqual(validateUpdateOperation(operation), {
      valid: false,
      errors: [
        new Error(
          "Updating the path 'foo.bar[1].baz' would create a conflict at 'foo.bar[1].baz'"
        ),
      ],
    });
  });

  it("returns invalid when an operation has two document paths, one of which is contained by the other", () => {
    const operation = {
      $set: { foo: [1] },
      $inc: { "foo[0]": 1 },
    };
    assert.deepEqual(validateUpdateOperation(operation), {
      valid: false,
      errors: [
        new Error(
          "Updating the path 'foo[0]' would create a conflict at 'foo'"
        ),
      ],
    });
  });

  it("returns invalid when an operation has two document paths, one of which is contained by the other", () => {
    const operation = {
      $set: { foo: [1] },
      $inc: { "foo[0]": 1 },
    };
    assert.deepEqual(validateUpdateOperation(operation), {
      valid: false,
      errors: [
        new Error(
          "Updating the path 'foo[0]' would create a conflict at 'foo'"
        ),
      ],
    });
  });

  it("returns invalid when an operation has two nested document paths, one of which is contained by the other", () => {
    const operation = {
      $set: { "foo.bar.baz": [1] },
      $inc: { "foo.bar": 1 },
    };
    assert.deepEqual(validateUpdateOperation(operation), {
      valid: false,
      errors: [
        new Error(
          "Updating the path 'foo.bar.baz' would create a conflict at 'foo.bar'"
        ),
      ],
    });
  });
  it("returns multiple errors when an operation has two or more conflicts", () => {
    const operation = {
      $set: { foo: { bar: [1] } },
      $inc: { "foo.bar[0]": 1 },
      $addToSet: { "foo.bar": 4 },
    };
    assert.deepEqual(validateUpdateOperation(operation), {
      valid: false,
      errors: [
        new Error(
          "Updating the path 'foo.bar[0]' would create a conflict at 'foo'"
        ),
        new Error(
          "Updating the path 'foo.bar[0]' would create a conflict at 'foo.bar'"
        ),
        new Error(
          "Updating the path 'foo.bar' would create a conflict at 'foo'"
        ),
      ],
    });
  });
});
