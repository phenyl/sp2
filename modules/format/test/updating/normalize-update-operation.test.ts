/* eslint-env mocha */
import {
  normalizeUpdateOperation,
  toUpdateOperation,
} from "../../src/updating/normalize-update-operation";

import assert from "assert";

describe("normalizeUpdateOperation", () => {
  it("converts key-value object to SetOperation", () => {
    const operation = { "name.first": "John" };
    const normalizedOperation = normalizeUpdateOperation(operation);
    assert.deepStrictEqual(normalizedOperation, {
      $set: {
        "name.first": "John",
      },
    });
  });

  it("doesn't convert key-value object when its first key starts with '$'", () => {
    const operation = { "$name.first": "John" };
    const normalizedOperation = normalizeUpdateOperation(operation);
    assert.deepStrictEqual(normalizedOperation, {
      "$name.first": "John",
    });
  });

  it("normalizes $push operation", () => {
    const operation = { $push: { hobbies: "tennis" } };
    const normalizedOperation = normalizeUpdateOperation(operation);
    assert.deepStrictEqual(normalizedOperation, {
      $push: {
        hobbies: { $each: ["tennis"] },
      },
    });
  });

  it("normalizes $addToSet operation", () => {
    const operation = { $addToSet: { hobbies: "tennis" } };
    const normalizedOperation = normalizeUpdateOperation(operation);
    assert.deepStrictEqual(normalizedOperation, {
      $addToSet: {
        hobbies: { $each: ["tennis"] },
      },
    });
  });

  it("doesn't normalize $pull operation", () => {
    const operation = { $pull: { hobbies: "tennis" } };
    const normalizedOperation = normalizeUpdateOperation(operation);
    assert.deepStrictEqual(normalizedOperation, {
      $pull: {
        hobbies: "tennis",
      },
    });
  });
});

describe("toUpdateOperation", () => {
  it("converts key-value object to SetOperation", () => {
    const operation = { "name.first": "John" };
    const normalizedOperation = toUpdateOperation(operation);
    assert.deepStrictEqual(normalizedOperation, {
      $set: {
        "name.first": "John",
      },
    });
  });

  it("doesn't convert key-value object when its first key starts with '$'", () => {
    const operation = { "$name.first": "John" };
    const normalizedOperation = toUpdateOperation(operation);
    assert.deepStrictEqual(normalizedOperation, {
      "$name.first": "John",
    });
  });
});
