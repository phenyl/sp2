/* eslint-env mocha */
import { Restorable } from "../../src/updating/update-operation";
import assert from "assert";

describe("Restorable", () => {
  // This test is in fact not dynamic one.
  // @Restorable operator is used for ensuring type of constructor's argument.
  it("restricts constructor argument type", () => {
    @Restorable<Person>()
    class Person {
      name: Name;

      // See how TypeScript and @Restorable() outputs errors when you modify the argument type below (like name => namae)
      constructor(params: { name: { first: string; last: string } }) {
        this.name = new Name(params.name);
      }
    }
    class Name {
      first: string;
      last: string;
      constructor(params: { first: string; last: string }) {
        this.first = params.first;
        this.last = params.last;
      }
    }
    const person = new Person({ name: { first: "John", last: "Doe" } });
    assert(person instanceof Person);
  });
});
