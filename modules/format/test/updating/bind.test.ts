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

  it("with documentPathCreator function: $docPath", () => {
    const { $docPath } = $bind();
    assert(typeof $docPath === "function");
  });

  it("with documentPathCreator function: $path", () => {
    const { $path } = $bind();
    assert(typeof $path === "function");
  });

  it("with retarget function: $retarget", () => {
    const { $retarget } = $bind();
    assert(typeof $retarget === "function");
  });

  it("with retarget function: $merge", () => {
    const { $merge } = $bind();
    assert(typeof $merge === "function");
  });

  it("with identical documentPathCreator functions: $path and $docPath", () => {
    const { $path, $docPath } = $bind();
    assert($path === $docPath);
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

  it("containing setter functions($set) and docPathGenerator($docPath) \
      which create UpdateOperation toward target object containing type parameter T", () => {
    type TargetObject<T> = { foo: T };

    function bar<T>(value: T) {
      const { $set, $docPath } = $bind<TargetObject<T>>();
      const path = $docPath("foo");
      const operation = $set(path, value);
      assert.deepStrictEqual(operation, {
        $set: { foo: value },
      });
    }
    bar("foo");
    bar(100);
  });

  it("with functions which create UpdateOperation with multiple docPaths", () => {
    type TargetObject = { foo: { bar: { name: string; age: number }[] } };
    const { $set, $path, $merge } = $bind<TargetObject>();
    const operations = [
      $set($path("foo", "bar", 0, "name"), "John"),
      $set($path("foo", "bar", 0, "age"), 32),
    ];
    assert.deepStrictEqual($merge(...operations), {
      $set: { "foo.bar[0].name": "John", "foo.bar[0].age": 32 },
    });
  });

  it("with function which retargets UpdateOperation", () => {
    type SubObject = { bar: { name: string; age: number }[] };
    type TargetObject = { foo: SubObject };
    const { $set, $docPath, $merge } = $bind<SubObject>();
    const { $retarget, $docPath: $mainDocPath } = $bind<TargetObject>();
    const subOperations = [
      $set($docPath("bar", 0, "name"), "John"),
      $set($docPath("bar", 0, "age"), 32),
    ];
    const retargetedOperation = $retarget(
      $mainDocPath("foo"),
      $merge(...subOperations)
    );
    assert.deepStrictEqual(retargetedOperation, {
      $set: { "foo.bar[0].name": "John", "foo.bar[0].age": 32 },
    });
  });

  it("with function which merges UpdateOperation", () => {
    type TargetObject = { foo: { name: string; age: number } };
    const { $set, $inc, $docPath, $merge } = $bind<TargetObject>();
    const retargetedOperation = $merge(
      $set($docPath("foo", "name"), "John"),
      $inc($docPath("foo", "age"), 1)
    );
    assert.deepStrictEqual(retargetedOperation, {
      $set: { "foo.name": "John" },
      $inc: { "foo.age": 1 },
    });
  });
});
