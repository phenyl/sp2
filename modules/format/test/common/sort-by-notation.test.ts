/* eslint-env mocha */
import assert from "assert";
import {
  sortByNotation,
  SortNotation,
} from "../../src/common/sort-by-notation";

describe("sortByNotation", () => {
  it("sorts string and number, 1 is ASC and -1 is DESC", () => {
    const sortNotation: SortNotation = {
      name: 1,
      age: -1,
    };
    const data = [
      { name: "AB", age: 3 },
      { name: "BC", age: 12 },
      { name: "AB", age: 10 },
    ];

    const sortedArr = sortByNotation(data, sortNotation);
    assert.deepEqual(sortedArr, [
      { name: "AB", age: 10 },
      { name: "AB", age: 3 },
      { name: "BC", age: 12 },
    ]);
  });
});
