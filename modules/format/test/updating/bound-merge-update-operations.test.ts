/* eslint-env mocha */
import { $bind } from "../../src/updating/bind";
import { $merge } from "../../src/updating/bound-merge-update-operations";
import assert from "assert";

describe("$update", () => {
  it("returns a function", () => {
    const merge = $merge();
    assert(typeof merge === "function");
  });

  it("returns a function merging nonbreaking BoundUpdateOperations", () => {
    type TargetObject = { foo: { bar: { name: string }[] }; baz: number };
    const merge = $merge<TargetObject>();
    const { $set, $docPath, $push } = $bind<TargetObject>();
    const op1 = $set($docPath("baz"), 123);
    const op2 = $push($docPath("foo", "bar"), { name: "John" });
    const merged = merge(op1, op2);
    assert.deepStrictEqual(merged, {
      $set: { baz: 123 },
      $push: { "foo.bar": { $each: [{ name: "John" }] } },
    });
  });

  it("returns a function merging nonbreaking BoundUpdateOperations", () => {
    type TargetObject = { foo: { bar: { name: string }[] }; baz: number };
    const merge = $merge<TargetObject>();
    const { $unset, $docPath, $push } = $bind<TargetObject>();
    const op1 = $unset($docPath("baz"), "");
    const op2 = $push($docPath("foo", "bar"), { name: "John" });
    const merged = merge(op1, op2);
    assert.deepStrictEqual(merged, {
      $unset: { baz: "" },
      $push: { "foo.bar": { $each: [{ name: "John" }] } },
    });
  });
});
