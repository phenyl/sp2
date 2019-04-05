/* eslint-env mocha */
import {
  AndFindOperation,
  SimpleFindOperation,
} from "../../src/retrieving/find-operation";

import assert from "assert";
import { toMongoFindOperation } from "../../src/retrieving/to-mongo-find-operation";

describe("toMongoFindOperation", () => {
  it("converts SimpleFindOperation's DocumentPaths", () => {
    const findOperation: SimpleFindOperation = {
      "foo.bar": "baz",
      "names[0].first": { $regex: /^J/ },
      "foo.bar[123][1000000]": { $gt: 19 },
    };

    const convertedOperation = toMongoFindOperation(findOperation);
    assert.deepEqual(convertedOperation, {
      "foo.bar": { $eq: "baz" },
      "names.0.first": { $regex: /^J/ },
      "foo.bar.123.1000000": { $gt: 19 },
    });
  });

  it("converts SimpleFindOperation's $elemMatch operands", () => {
    const findOperation: SimpleFindOperation = {
      "foo.bar": { $elemMatch: { "abc[1].def": "foobar" } },
      "names[0].first": { $regex: /^J/, $elemMatch: { $regex: /^J/ } },
      "foo.bar[123][1000000]": { $gt: 19, $elemMatch: 30 },
    };

    const convertedOperation = toMongoFindOperation(findOperation);
    assert.deepEqual(convertedOperation, {
      "foo.bar": { $elemMatch: { "abc.1.def": { $eq: "foobar" } } },
      "names.0.first": { $regex: /^J/, $elemMatch: { $regex: /^J/ } },
      "foo.bar.123.1000000": { $gt: 19, $elemMatch: 30 },
    });
  });

  it("converts SimpleFindOperation's $elemMatch operands recursively", () => {
    const findOperation: SimpleFindOperation = {
      "foo.bar": {
        $elemMatch: {
          "abc[1].def": { $elemMatch: { "baz.biz[1][2][3]": "foobar" } },
        },
      },
    };

    const convertedOperation = toMongoFindOperation(findOperation);
    assert.deepEqual(convertedOperation, {
      "foo.bar": {
        $elemMatch: {
          "abc.1.def": { $elemMatch: { "baz.biz.1.2.3": { $eq: "foobar" } } },
        },
      },
    });
  });

  it("converts AndFindOperation's DocumentPaths", () => {
    const findOperation: AndFindOperation = {
      $and: [
        { "foo.bar": "baz" },
        { "names[0].first": { $regex: /^J/ } },
        { "foo.bar[123][1000000]": { $gt: 19, $elemMatch: ["abc"] } },
      ],
    };
    const convertedOperation = toMongoFindOperation(findOperation);
    assert.deepEqual(convertedOperation, {
      $and: [
        { "foo.bar": { $eq: "baz" } },
        { "names.0.first": { $regex: /^J/ } },
        { "foo.bar.123.1000000": { $gt: 19, $elemMatch: ["abc"] } },
      ],
    });
  });
});
