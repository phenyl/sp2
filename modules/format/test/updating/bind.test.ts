/* eslint-env mocha */
import { $bind } from "../../src/updating/bind";
import assert from "assert";

describe("$bind returns an object", () => {
  it("with setter functions", () => {
    const { $set, $addToSet, $inc } = $bind();
    assert(typeof $set === "function");
    assert(typeof $addToSet === "function");
    assert(typeof $inc === "function");
  });

  it("with documentPathCreator function", () => {
    const { $docPath } = $bind();
    assert(typeof $docPath === "function");
  });

  it("with retarget function", () => {
    const { $retarget } = $bind();
    assert(typeof $retarget === "function");
  });

  it("containing setter functions($set) and docPathGenerator($docPath) \
      which create UpdateOperation toward target object passed via type parameter", () => {
    type TargetObject = { foo: { bar: { name: string }[] } };
    const { $set, $docPath } = $bind<TargetObject>();
    const operation = $set($docPath("foo"), { bar: [{ name: "John" }] });
    assert.deepStrictEqual(operation, {
      $set: { foo: { bar: [{ name: "John" }] } },
    });
  });

  it("with functions which create UpdateOperation with multiple docPaths", () => {
    type TargetObject = { foo: { bar: { name: string; age: number }[] } };
    const { $set, $docPath } = $bind<TargetObject>();
    const operation = $set(
      [$docPath("foo", "bar", 0, "name"), "John"],
      [$docPath("foo", "bar", 0, "age"), 32]
    );
    assert.deepStrictEqual(operation, {
      $set: { "foo.bar[0].name": "John", "foo.bar[0].age": 32 },
    });
  });

  it("with functions which retarget UpdateOperation", () => {
    type SubObject = { bar: { name: string; age: number }[] };
    type TargetObject = { foo: SubObject };
    const { $set, $docPath } = $bind<SubObject>();
    const { $retarget, $docPath: $mainDocPath } = $bind<TargetObject>();
    const subOperation = $set(
      [$docPath("bar", 0, "name"), "John"],
      [$docPath("bar", 0, "age"), 32]
    );
    const retargetedOperation = $retarget($mainDocPath("foo"), subOperation);
    assert.deepStrictEqual(retargetedOperation, {
      $set: { "foo.bar[0].name": "John", "foo.bar[0].age": 32 },
    });
  });
});
