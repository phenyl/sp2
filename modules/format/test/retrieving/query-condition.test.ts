/* eslint-env mocha */

import {
  getBSONTypeNumber,
  getBSONTypeString,
  isQueryCondition,
} from "../../src/retrieving/query-condition";

import assert from "assert";

describe("getBSONTypeString", () => {
  it("returns type name corresponding the given variable type", () => {
    assert.equal(getBSONTypeString(1), "int");
    assert.equal(getBSONTypeString(-1.3), "double");
    assert.equal(getBSONTypeString("foo.bar"), "string");
    assert.equal(getBSONTypeString(false), "bool");
    assert.equal(getBSONTypeString(undefined), "undefined");
    assert.equal(getBSONTypeString(() => {}), "javascript");
    assert.equal(getBSONTypeString(null), "null");
    assert.equal(getBSONTypeString(/[a-z]/g), "regex");
    assert.equal(getBSONTypeString(new Date()), "date");
    assert.equal(getBSONTypeString([]), "array");
    assert.equal(getBSONTypeString({}), "object");
  });
});

describe("getBSONTypeNumber", () => {
  it("returns number corresponding the given variable type", () => {
    assert.equal(getBSONTypeNumber(1), 16);
    assert.equal(getBSONTypeNumber(-1.3), 1);
    assert.equal(getBSONTypeNumber("foo.bar"), 2);
    assert.equal(getBSONTypeNumber(false), 8);
    assert.equal(getBSONTypeNumber(undefined), 6);
    assert.equal(getBSONTypeNumber(() => {}), 13);
    assert.equal(getBSONTypeNumber(null), 10);
    assert.equal(getBSONTypeNumber(/[a-z]/g), 11);
    assert.equal(getBSONTypeNumber(new Date()), 9);
    assert.equal(getBSONTypeNumber([]), 4);
    assert.equal(getBSONTypeNumber({}), 3);
  });
});

describe("isQueryCondition", () => {
  it("returns false if null is given", () => {
    assert(isQueryCondition(null) === false);
  });
  it("returns false if boolean is given", () => {
    assert(isQueryCondition(true) === false);
  });
  it("returns false if string is given", () => {
    assert(isQueryCondition("query") === false);
  });
  it("returns false if empty object is given", () => {
    assert(isQueryCondition({}) === false);
  });
  it("returns false if empty array is given", () => {
    assert(isQueryCondition([]) === false);
  });
  it("returns false if RegExp is given", () => {
    assert(isQueryCondition(/foo/) === false);
  });
  it("returns true if an object with its firstKey starts from '$' is given", () => {
    assert(isQueryCondition({ $: 1 }) === true);
  });
  it("returns false if an object with its firstKey doesn't start from '$' is given", () => {
    assert(isQueryCondition({ a: 1, $: 2 }) === false);
  });
});
