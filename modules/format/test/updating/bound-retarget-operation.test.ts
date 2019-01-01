/* eslint-env mocha */
import { $path } from "../../src/common/bound-document-path";
import { $retarget } from "../../src/updating/bound-retarget-operation";
import { $update } from "../../src/updating/bound-create-update-operation";
import assert from "assert";

describe("$retarget returns a function", () => {
  it("UpdateOperation", () => {
    const retarget = $retarget();
    assert(typeof retarget === "function");
  });

  it("returns a function retargetting the given UpdateOperation to the given docPath", () => {
    type Name = { first: string; last: string };
    type Person = { name: Name };
    const { $set } = $update<Name>();
    const retargetedOperation = $retarget<Person>()(
      $path<Person>()("name"),
      $set($path<Name>()("first"), "John")
    );

    assert.deepStrictEqual(retargetedOperation, {
      $set: {
        "name.first": "John",
      },
    });
  });

  it("returns a function retargetting the given breaking UpdateOperation to the given docPath", () => {
    type Name = { first: string; last: string };
    type Person = { name: Name };
    const { $unset } = $update<Name>();
    const retargetedOperation = $retarget<Person>()(
      $path<Person>()("name"),
      $unset($path<Name>()("first"), "")
    );

    assert.deepStrictEqual(retargetedOperation, {
      $unset: {
        "name.first": "",
      },
    });
  });
});
