import {
  SortNotation,
  sortByNotation,
} from "../../src/common/sort-by-notation";

/* eslint-env mocha */
import assert from "assert";

describe("sortByNotation", () => {
  it("sorts values by direction, 1 is ASC and -1 is DESC", () => {
    const sortNotation: SortNotation = -1;
    const data = ["foo", "bar", "baz", "foo"];

    const sortedArr = sortByNotation(data, sortNotation);
    assert.deepEqual(sortedArr, ["foo", "foo", "baz", "bar"]);
  });

  it("sorts given props (string and number), 1 is ASC and -1 is DESC", () => {
    const sortNotation: SortNotation = {
      name: 1,
      age: -1,
    };
    const data = [
      { name: "AB", age: 3 },
      { name: "BC", age: 12 },
      { name: "AB", age: 10 },
      { name: "AB", age: 10 },
    ];

    const sortedArr = sortByNotation(data, sortNotation);
    assert.deepEqual(sortedArr, [
      { name: "AB", age: 10 },
      { name: "AB", age: 10 },
      { name: "AB", age: 3 },
      { name: "BC", age: 12 },
    ]);
  });
});
