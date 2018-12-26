/* eslint-env mocha */
import { $path } from "../../src/common/bound-document-path";
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
});
