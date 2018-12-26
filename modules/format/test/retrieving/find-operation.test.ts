/* eslint-env mocha */
import {
  isAndFindOperation,
  isNorFindOperation,
  isOrFindOperation,
} from "../../src/retrieving/find-operation";

import assert from "assert";

describe("isAndFindOperation", () => {
  it("returns true if $and property exists", () => {
    assert(isAndFindOperation({ $and: [] }) === true);
  });
  it("returns false if $and property doesn't exist", () => {
    assert(isAndFindOperation({ $or: [] }) === false);
  });
});

describe("isOrFindOperation", () => {
  it("returns true if $or property exists", () => {
    assert(isOrFindOperation({ $or: [] }) === true);
  });
  it("returns false if $or property doesn't exist", () => {
    assert(isOrFindOperation({ $nor: [] }) === false);
  });
});

describe("isNorFindOperation", () => {
  it("returns true if $nor property exists", () => {
    assert(isNorFindOperation({ $nor: [] }) === true);
  });
  it("returns false if $nor property doesn't exist", () => {
    assert(isNorFindOperation({ $and: [] }) === false);
  });
});
