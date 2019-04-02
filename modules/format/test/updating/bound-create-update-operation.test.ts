/* eslint-env mocha */
import { $op } from "../../src/updating/bound-create-update-operation";
import { $path } from "../../src/common/bound-document-path";
import assert from "assert";

describe("$op", () => {
  it("returns an object with setter functions", () => {
    const updater = $op();
    assert(typeof updater.$set === "function");
    assert(typeof updater.$addToSet === "function");
    assert(typeof updater.$restore === "function");
  });

  describe("results of $op(), containing functions all of which create UpdateOperation", () => {
    it("contains $set function", () => {
      type TargetObject = { foo: { bar: { name: string }[] } };
      const { $set } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $set($docPath("foo", "bar", 0, "name"), "John");
      assert.deepStrictEqual(operation, {
        $set: { "foo.bar[0].name": "John" },
      });
    });

    it("contains $set function accepting accesses to optional props", () => {
      type TargetObject = { foo?: { bar?: { name?: string }[] } };
      const { $set } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $set($docPath("foo", "bar", 0, "name"), "John");
      assert.deepStrictEqual(operation, {
        $set: { "foo.bar[0].name": "John" },
      });
    });

    it("contains $inc function", () => {
      type TargetObject = { foo: { bar: { age: number } } };
      const { $inc } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $inc($docPath("foo", "bar", "age"), 1);
      assert.deepStrictEqual(operation, {
        $inc: { "foo.bar.age": 1 },
      });
    });

    it("contains $inc function accepting accesses to optional props", () => {
      type TargetObject = { foo?: { bar?: { age?: number } } };
      const { $inc } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $inc($docPath("foo", "bar", "age"), 1);
      assert.deepStrictEqual(operation, {
        $inc: { "foo.bar.age": 1 },
      });
    });

    it("contains $min function", () => {
      type TargetObject = { foo: { bar: { age: number } } };
      const { $min } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $min($docPath("foo", "bar", "age"), 10);
      assert.deepStrictEqual(operation, {
        $min: { "foo.bar.age": 10 },
      });
    });

    it("contains $max function", () => {
      type TargetObject = { foo: { bar: { age: number } } };
      const { $max } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $max($docPath("foo", "bar", "age"), 100);
      assert.deepStrictEqual(operation, {
        $max: { "foo.bar.age": 100 },
      });
    });

    it("contains $mul function", () => {
      type TargetObject = { foo: { bar: { age: number } } };
      const { $mul } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $mul($docPath("foo", "bar", "age"), 2);
      assert.deepStrictEqual(operation, {
        $mul: { "foo.bar.age": 2 },
      });
    });

    it("contains $addToSet function", () => {
      type TargetObject = { foo: { bar: { age: number }[] } };
      const { $addToSet } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $addToSet($docPath("foo", "bar"), { age: 32 });
      assert.deepStrictEqual(operation, {
        $addToSet: { "foo.bar": { age: 32 } },
      });
    });

    it("contains $addToSet function", () => {
      type TargetObject = { foo: { bar: { age: number }[] } };
      const { $addToSet } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $addToSet($docPath("foo", "bar"), { age: 32 });
      assert.deepStrictEqual(operation, {
        $addToSet: { "foo.bar": { age: 32 } },
      });
    });

    it("contains $pop function", () => {
      type TargetObject = { foo: { bar: { age: number }[] } };
      const { $pop } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $pop($docPath("foo", "bar"), -1);
      assert.deepStrictEqual(operation, {
        $pop: { "foo.bar": -1 },
      });
    });

    it("contains $pull function", () => {
      type TargetObject = { foo: { bar: { age: number }[] } };
      const { $pull } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $pull($docPath("foo", "bar"), { $gt: { age: 30 } });
      assert.deepStrictEqual(operation, {
        $pull: { "foo.bar": { $gt: { age: 30 } } },
      });
    });

    it("contains $push function", () => {
      type TargetObject = { foo: { bar: { age: number }[] } };
      const { $push } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $push($docPath("foo", "bar"), { age: 30 });
      assert.deepStrictEqual(operation, {
        $push: { "foo.bar": { age: 30 } },
      });
    });

    it("contains $push function accepting accesses to optional props", () => {
      type TargetObject = { foo?: { bar?: { age?: number }[] } };
      const { $push } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $push($docPath("foo", "bar"), { age: 30 });
      assert.deepStrictEqual(operation, {
        $push: { "foo.bar": { age: 30 } },
      });
    });

    it("contains $currentDate function", () => {
      type TargetObject = { foo: { bar: { date: number } } };
      const { $currentDate } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $currentDate($docPath("foo", "bar", "date"), {
        $type: "timestamp",
      });
      assert.deepStrictEqual(operation, {
        $currentDate: { "foo.bar.date": { $type: "timestamp" } },
      });
    });

    it("contains $bit function", () => {
      type TargetObject = { foo: { bar: { flags: number } } };
      const { $bit } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $bit($docPath("foo", "bar", "flags"), { and: 0x8f });
      assert.deepStrictEqual(operation, {
        $bit: { "foo.bar.flags": { and: 0x8f } },
      });
    });

    it("contains $unset function", () => {
      type TargetObject = { foo: { bar: { baz: number } } };
      const { $unset } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $unset($docPath("foo", "bar", "baz"), "");
      assert.deepStrictEqual(operation, {
        $unset: { "foo.bar.baz": "" },
      });
    });

    it("contains $unset function accepting accesses to optional props", () => {
      type TargetObject = { foo?: { bar?: { baz?: number } } };
      const { $unset } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $unset($docPath("foo", "bar", "baz"), "");
      assert.deepStrictEqual(operation, {
        $unset: { "foo.bar.baz": "" },
      });
    });

    it("contains $restore function", () => {
      type TargetObject = { foo: { bar: { date: Date } } };
      const { $restore } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $restore($docPath("foo", "bar", "date"), "");
      assert.deepStrictEqual(operation, {
        $restore: { "foo.bar.date": "" },
      });
    });

    it("contains rename function", () => {
      type TargetObject = { foo: { bar: { bza: number } } };
      const { $rename } = $op<TargetObject>();
      const $docPath = $path<TargetObject>();
      const operation = $rename($docPath("foo", "bar", "bza"), "baz");
      assert.deepStrictEqual(operation, {
        $rename: { "foo.bar.bza": "baz" },
      });
    });
  });
});
