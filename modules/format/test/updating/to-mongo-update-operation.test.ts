/* eslint-env mocha */
import assert from "assert";
import { toMongoUpdateOperation } from "../../src/updating/to-mongo-update-operation";

describe("toMongoUpdateOperation", () => {
  it("converts DocumentPaths to dot notation strings", () => {
    const operation = {
      $set: { "foo.bar": 123, "abc[1].def": true },
      $unset: { "baz.biz[14][0][100000].foo": "" },
    };
    const convertedOperation = toMongoUpdateOperation(operation);
    assert.deepEqual(convertedOperation, {
      $set: { "foo.bar": 123, "abc.1.def": true },
      $unset: { "baz.biz.14.0.100000.foo": "" },
    });
  });

  it("converts RenameOperand's path", () => {
    const operation = {
      $set: { "foo.bar": 123, "abc[1].def": true },
      $rename: { "baz.biz[14][0][100000].foo": "bar" },
    };
    const convertedOperation = toMongoUpdateOperation(operation);
    assert.deepEqual(convertedOperation, {
      $set: { "foo.bar": 123, "abc.1.def": true },
      $rename: { "baz.biz.14.0.100000.foo": "baz.biz.14.0.100000.bar" },
    });
  });

  it("converts PullOperand's values", () => {
    const operation = {
      $pull: {
        "foo.num": 100,
        "foo.arr": ["abc"],
        "foo[1].bar": { "baz[1].biz": 123 },
      },
    };
    const convertedOperation = toMongoUpdateOperation(operation);
    assert.deepEqual(convertedOperation, {
      $pull: {
        "foo.num": 100,
        "foo.arr": ["abc"],
        "foo.1.bar": { "baz.1.biz": { $eq: 123 } },
      },
    });
  });

  it("converts AppendOperand into SetOperand", () => {
    const operation = {
      $append: {
        "foo.bar1": { baz: 100, biz: { abc: 123 } },
        "foo.bar2": { baz: "xxx", biz: { abc: "yyy" } },
      },
    };
    const convertedOperation = toMongoUpdateOperation(operation);
    assert.deepEqual(convertedOperation, {
      $set: {
        "foo.bar1.baz": 100,
        "foo.bar1.biz": { abc: 123 },
        "foo.bar2.baz": "xxx",
        "foo.bar2.biz": { abc: "yyy" },
      },
    });
  });

  it("converts AppendOperand into SetOperand and override an existing SetOperand", () => {
    const operation = {
      $set: {
        hoge: 123,
        "foo.bar1.baz": 90,
      },
      $append: {
        "foo.bar1": { baz: 100, biz: { abc: 123 } },
        "foo.bar2": { baz: "xxx", biz: { abc: "yyy" } },
      },
    };
    const convertedOperation = toMongoUpdateOperation(operation);
    assert.deepEqual(convertedOperation, {
      $set: {
        hoge: 123,
        "foo.bar1.baz": 100,
        "foo.bar1.biz": { abc: 123 },
        "foo.bar2.baz": "xxx",
        "foo.bar2.biz": { abc: "yyy" },
      },
    });
  });
});
