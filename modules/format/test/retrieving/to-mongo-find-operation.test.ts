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
      "foo.bar": "baz",
      "names.0.first": { $regex: /^J/ },
      "foo.bar.123.1000000": { $gt: 19 },
    });
  });

  it("converts AndFindOperation's DocumentPaths", () => {
    const findOperation: AndFindOperation = {
      $and: [
        { "foo.bar": "baz" },
        { "names[0].first": { $regex: /^J/ } },
        { "foo.bar[123][1000000]": { $gt: 19 } },
      ],
    };
    const convertedOperation = toMongoFindOperation(findOperation);
    assert.deepEqual(convertedOperation, {
      $and: [
        { "foo.bar": "baz" },
        { "names.0.first": { $regex: /^J/ } },
        { "foo.bar.123.1000000": { $gt: 19 } },
      ],
    });
  });
});
