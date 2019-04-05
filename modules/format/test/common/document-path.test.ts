/* eslint-env mocha */
import {
  convertToDotNotationString,
  createDocumentPath,
  getNestedValueWithoutType,
  hasOwnNestedProperty,
  parseDocumentPath,
} from "../../src/common/document-path";

import assert from "assert";

describe("parseDocumentPath", () => {
  it("parses documentPath", () => {
    const docPath = "user.favorites[1].music[30000]";
    const attributes = parseDocumentPath(docPath);
    assert.deepEqual(attributes, ["user", "favorites", 1, "music", 30000]);
  });
  it("not parses escaped path", () => {
    const docPath = "user.name\\.profile.favorites[1].music[30000]";
    const attributes = parseDocumentPath(docPath);
    assert.deepEqual(attributes, [
      "user",
      "name.profile",
      "favorites",
      1,
      "music",
      30000,
    ]);
  });
});

describe("convertToDotNotation", () => {
  it("converts docPath to dotNotationString", () => {
    const docPath = "user.favorites[1].music[30000]";
    const dotnotationString = convertToDotNotationString(docPath);
    assert(dotnotationString === "user.favorites.1.music.30000");
  });

  it("converts [1] to 1", () => {
    const docPath = "[1].name";
    const dotnotationString = convertToDotNotationString(docPath);
    assert.equal(dotnotationString, "1.name");
  });
});

describe("createDocumentPath", () => {
  it("converts attributes list to DocumentPath", () => {
    const attrs = [
      "users",
      1,
      "favorites",
      "musics",
      24,
      "title",
      "3",
      "value",
    ];
    const docPath = createDocumentPath(...attrs);
    assert(docPath === "users[1].favorites.musics[24].title.3.value");
  });
  it("returns empty string when no attribute list is given", () => {
    assert(createDocumentPath() === "");
  });
  it("converts dot included attribute to escaped path", () => {
    const attrs = ["user", "name.profile", "favorites", 1, "music", 30000];
    const docPath = createDocumentPath(...attrs);
    assert(docPath === "user.name\\.profile.favorites[1].music[30000]");
  });
});

describe("getNestedValueWithoutType", () => {
  const obj = {
    foo: { bar: [{}, {}, { baz1: false, baz2: null }] },
    foo2: undefined,
  };

  it("returns a nested value", () => {
    assert(getNestedValueWithoutType(obj, "foo") === obj.foo);
    assert(getNestedValueWithoutType(obj, "foo.bar") === obj.foo.bar);
    assert(getNestedValueWithoutType(obj, "foo.bar[0]") === obj.foo.bar[0]);
    assert(getNestedValueWithoutType(obj, "foo.bar[1]") === obj.foo.bar[1]);
    assert(getNestedValueWithoutType(obj, "foo.bar[2]") === obj.foo.bar[2]);
    assert(
      getNestedValueWithoutType(obj, "foo.bar[2].baz1") === obj.foo.bar[2].baz1
    );
    assert(
      getNestedValueWithoutType(obj, "foo.bar[2].baz2") === obj.foo.bar[2].baz2
    );
    assert(getNestedValueWithoutType(obj, "foo2") === obj.foo2);
  });

  it("returns undefined when nested value is not found.", () => {
    assert(getNestedValueWithoutType(obj, "a.b.c.d.e") === undefined);
  });

  it("throws error when the 3rd argument is true and nested value is not found.", () => {
    assert.throws(
      () => getNestedValueWithoutType(obj, "a.b.c.d.e", true),
      /Cannot get value/
    );
  });
});

describe("hasOwnNestedProperty", () => {
  const obj = {
    foo: { bar: [{}, {}, { baz1: false, baz2: null }] },
    foo2: undefined,
  };

  it("returns true when it has own nested property", () => {
    assert(hasOwnNestedProperty(obj, "foo") === true);
    assert(hasOwnNestedProperty(obj, "foo.bar") === true);
    assert(hasOwnNestedProperty(obj, "foo.bar[0]") === true);
    assert(hasOwnNestedProperty(obj, "foo.bar[1]") === true);
    assert(hasOwnNestedProperty(obj, "foo.bar[2]") === true);
    assert(hasOwnNestedProperty(obj, "foo.bar[2].baz1") === true);
    assert(hasOwnNestedProperty(obj, "foo.bar[2].baz2") === true);
    assert(hasOwnNestedProperty(obj, "foo2") === true);
  });

  it("returns false when it doesn't have own nested property", () => {
    assert(hasOwnNestedProperty(obj, "bar") === false);
    assert(hasOwnNestedProperty(obj, "foo.baz") === false);
    assert(hasOwnNestedProperty(obj, "foo.bar[3]") === false);
    assert(hasOwnNestedProperty(obj, "foo.bar[2].baz3") === false);
  });
});
