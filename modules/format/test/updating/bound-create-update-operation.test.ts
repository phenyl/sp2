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

  it("returns an object with setter functions which create UpdateOperation toward target object passed via type parameter", () => {
    type TargetObject = { foo: { bar: { name: string }[] } };
    const { $set } = $op<TargetObject>();
    const $docPath = $path<TargetObject>();
    const operation = $set($docPath("foo"), { bar: [{ name: "John" }] });
    assert.deepStrictEqual(operation, {
      $set: { foo: { bar: [{ name: "John" }] } },
    });
  });
});
