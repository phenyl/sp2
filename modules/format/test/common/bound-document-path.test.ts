/* eslint-env mocha */
import { $path, getNestedValue } from "../../src/common/bound-document-path";

import assert from "assert";

describe("$path", () => {
  it("returns a function", () => {
    const createDocumentPath = $path();
    assert(typeof createDocumentPath === "function");
  });
  it("returns a function creating documentPath of target object passed via type parameter", () => {
    type TargetObject = { foo: { bar: { name: string }[] } };
    const createDocumentPath = $path<TargetObject>();
    assert(createDocumentPath("foo") === "foo");
    assert(createDocumentPath("foo", "bar") === "foo.bar");
    assert(createDocumentPath("foo", "bar", 1) === "foo.bar[1]");
    assert(createDocumentPath("foo", "bar", 1, "name") === "foo.bar[1].name");
  });

  it("returns a function which allows optional documentPath", () => {
    type TargetObject = { foo?: { bar?: { name?: string }[] } };
    const createDocumentPath = $path<TargetObject>();
    assert(createDocumentPath("foo") === "foo");
    assert(createDocumentPath("foo", "bar") === "foo.bar");
    assert(createDocumentPath("foo", "bar", 1) === "foo.bar[1]");
    assert(createDocumentPath("foo", "bar", 1, "name") === "foo.bar[1].name");
  });
});

describe("getNestedValue", () => {
  it("returns a function getting nested value of given object at given documentPath", () => {
    type TargetObject = { foo: { bar: { name: string }[] } };
    const p = $path<TargetObject>();
    const obj: TargetObject = { foo: { bar: [{ name: "John" }] } };

    assert.deepStrictEqual(getNestedValue(obj, p("foo")), {
      bar: [{ name: "John" }],
    });

    assert.deepStrictEqual(getNestedValue(obj, p("foo", "bar")), [
      { name: "John" },
    ]);

    assert.deepStrictEqual(getNestedValue(obj, p("foo", "bar", 0)), {
      name: "John",
    });

    assert.deepStrictEqual(
      getNestedValue(obj, p("foo", "bar", 0, "name")),
      "John"
    );
  });

  it("returns a function which accepts optional documentPaths", () => {
    type TargetObject = { foo?: { bar?: { name?: string }[] } };
    const p = $path<TargetObject>();
    const obj: TargetObject = { foo: { bar: [{ name: "John" }] } };

    assert.deepStrictEqual(getNestedValue(obj, p("foo")), {
      bar: [{ name: "John" }],
    });

    assert.deepStrictEqual(getNestedValue(obj, p("foo", "bar")), [
      { name: "John" },
    ]);

    assert.deepStrictEqual(getNestedValue(obj, p("foo", "bar", 0)), {
      name: "John",
    });

    assert.deepStrictEqual(
      getNestedValue(obj, p("foo", "bar", 0, "name")),
      "John"
    );
  });
});
