import assert from "assert";
/* eslint-env mocha */
import { normalizeQueryCondition } from "../../src/retrieving/normalize-query-condition";

describe("normalizeQueryCondition", () => {
  it("converts simple condition to $eq condition", () => {
    const condition = { name: "John" };
    const converted = normalizeQueryCondition(condition);
    assert.deepStrictEqual(converted, { $eq: { name: "John" } });
  });

  it("converts null to condoition with { $eq: null } ", () => {
    const converted = normalizeQueryCondition(null);
    assert.deepStrictEqual(converted, { $eq: null });
  });

  it("converts RegExp to condoition with $regex operator", () => {
    const converted = normalizeQueryCondition(/[a-z]/g);
    assert.deepStrictEqual(converted, { $regex: /[a-z]/g });
  });

  it("doesn't convert anything if condition's first key starts with '$'", () => {
    const condition = { $foo: {}, abc: 123 };
    const converted = normalizeQueryCondition(condition);
    assert.strictEqual(converted, condition);
  });

  it("converts to $eq condition if condition's first key doesn't start with '$'", () => {
    const condition = { foo: {}, $eq: { "name.first": "John" } };
    const converted = normalizeQueryCondition(condition);
    assert.deepStrictEqual(converted, { $eq: condition });
  });
});
