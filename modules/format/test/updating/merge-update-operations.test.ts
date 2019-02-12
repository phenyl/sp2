/* eslint-env mocha */
import assert from "assert";
import { mergeUpdateOperations } from "../../src/updating/merge-update-operations";

describe("mergeUpdateOperations", () => {
  it("merges operations after normalization", () => {
    const op1 = { "name.first": "John" };
    const op2 = { $set: { age: 32 } };
    const op3 = { $push: { hobby: "tennis" } };
    const op4 = { $unset: { "name.middle": "" } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3, op4);
    assert.deepStrictEqual(mergedOperation, {
      $set: {
        "name.first": "John",
        age: 32,
      },
      $push: {
        hobby: { $each: ["tennis"] },
      },
      $unset: {
        "name.middle": "",
      },
    });
  });

  it("merges $push operands deeply", () => {
    const op1 = { $push: { hobby: "tennis" } };
    const op2 = { $push: { hobby: "jogging" } };
    const op3 = { $push: { hobby: "skiing" } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3);
    assert.deepStrictEqual(mergedOperation, {
      $push: {
        hobby: { $each: ["tennis", "jogging", "skiing"] },
      },
    });
  });

  it("merges $addToSet operands deeply", () => {
    const op1 = { $addToSet: { hobby: "tennis" } };
    const op2 = { $addToSet: { hobby: "jogging" } };
    const op3 = { $addToSet: { hobby: "skiing" } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3);
    assert.deepStrictEqual(mergedOperation, {
      $addToSet: {
        hobby: { $each: ["tennis", "jogging", "skiing"] },
      },
    });
  });

  it("sums up $inc operands", () => {
    const op1 = { $inc: { age: 1 } };
    const op2 = { $inc: { age: 2 } };
    const op3 = { $inc: { age: 5 } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3);
    assert.deepStrictEqual(mergedOperation, {
      $inc: {
        age: 1 + 2 + 5,
      },
    });
  });

  it("chooses the minimum one in all $min operands", () => {
    const op1 = { $min: { price: 1000 } };
    const op2 = { $min: { price: 1200 } };
    const op3 = { $min: { price: 1800 } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3);
    assert.deepStrictEqual(mergedOperation, {
      $min: {
        price: 1000,
      },
    });
  });

  it("sums up $max operands", () => {
    const op1 = { $max: { price: 1300 } };
    const op2 = { $max: { price: 700 } };
    const op3 = { $max: { price: 1200 } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3);
    assert.deepStrictEqual(mergedOperation, {
      $max: {
        price: 1300,
      },
    });
  });

  it("multiplies $mul operands", () => {
    const op1 = { $mul: { point: 3 } };
    const op2 = { $mul: { point: 2 } };
    const op3 = { $mul: { point: 7 } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3);
    assert.deepStrictEqual(mergedOperation, {
      $mul: {
        point: 3 * 2 * 7,
      },
    });
  });

  it("overwrites former objects to the latter one if the same key is given in $set operand", () => {
    const op1 = { name: { first: "John" } };
    const op2 = { name: { middle: "M" } };
    const op3 = { name: { last: "Doe" } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3);
    assert.deepStrictEqual(mergedOperation, {
      $set: {
        name: { last: "Doe" },
      },
    });
  });

  it("doesn't convert instances to plain objects", () => {
    class Person {
      name: string;
      constructor(name: string) {
        this.name = name;
      }
    }
    const op1 = { person: new Person("Shin") };
    const op2 = { person: new Person("John") };
    const mergedOperation = mergeUpdateOperations(op1, op2);
    assert(mergedOperation.$set!.person instanceof Person);
    assert.deepStrictEqual(mergedOperation, {
      $set: { person: new Person("John") },
    });
  });

  it("merges $push, $addToSet, $inc and $mul operands and overwrites other operands", () => {
    const op1 = {
      $addToSet: { "profile.hobbies": "tennis" },
      $push: { "profile.nationalities": "Japan" },
      $inc: { "profile.age": 1 },
      $mul: { "profile.point.value": 5 },
      $set: { "profile.name.first": "Shin", "profile.name.last": "Suzuki" },
    };
    const op2 = {
      $addToSet: { "profile.hobbies": "jogging" },
      $push: {
        "profile.nationalities": { $each: ["United States", "Thailand"] },
        "profile.favoriteFoods": { $each: ["sukiyaki", "sushi"] },
      },
      $inc: { "profile.age": 3 },
      $mul: { "profile.point.value": 6 },
      $set: { "profile.name.last": "Doe" },
    };
    const mergedOperation = mergeUpdateOperations(op1, op2);
    assert.deepStrictEqual(mergedOperation, {
      $addToSet: {
        "profile.hobbies": { $each: ["tennis", "jogging"] },
      },
      $push: {
        "profile.nationalities": {
          $each: ["Japan", "United States", "Thailand"],
        },
        "profile.favoriteFoods": {
          $each: ["sukiyaki", "sushi"],
        },
      },
      $inc: {
        "profile.age": 1 + 3,
      },
      $mul: {
        "profile.point.value": 5 * 6,
      },
      $set: { "profile.name.first": "Shin", "profile.name.last": "Doe" },
    });
  });
});
