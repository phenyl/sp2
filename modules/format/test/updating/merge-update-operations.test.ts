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
    const op1 = { $inc: { age: 1, foo: 3 } };
    const op2 = { $inc: { age: 2, bar: 6 } };
    const op3 = { $inc: { age: 5, baz: -2 } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3);
    assert.deepStrictEqual(mergedOperation, {
      $inc: {
        age: 1 + 2 + 5,
        foo: 3,
        bar: 6,
        baz: -2,
      },
    });
  });

  it("chooses the minimum one in all $min operands", () => {
    const op1 = { $min: { price: 1000, foo: 3 } };
    const op2 = { $min: { price: 1200, bar: 6 } };
    const op3 = { $min: { price: 1800, baz: -2 } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3);
    assert.deepStrictEqual(mergedOperation, {
      $min: {
        price: 1000,
        foo: 3,
        bar: 6,
        baz: -2,
      },
    });
  });

  it("sums up $max operands", () => {
    const op1 = { $max: { price: 1300, foo: 3 } };
    const op2 = { $max: { price: 700, bar: 6 } };
    const op3 = { $max: { price: 1200, baz: -2 } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3);
    assert.deepStrictEqual(mergedOperation, {
      $max: {
        price: 1300,
        foo: 3,
        bar: 6,
        baz: -2,
      },
    });
  });

  it("multiplies $mul operands", () => {
    const op1 = { $mul: { point: 3, foo: 3 } };
    const op2 = { $mul: { point: 2, bar: 6 } };
    const op3 = { $mul: { point: 7, baz: -2 } };
    const mergedOperation = mergeUpdateOperations(op1, op2, op3);
    assert.deepStrictEqual(mergedOperation, {
      $mul: {
        point: 3 * 2 * 7,
        foo: 3,
        bar: 6,
        baz: -2,
      },
    });
  });

  it("merges $pull operands with different $eq query operators", () => {
    const op1 = { $pull: { foo: { $eq: "1" } } };
    const op2 = { $pull: { foo: { $eq: "2" } } };
    const mergedOperation = mergeUpdateOperations(op1, op2);
    assert.deepStrictEqual(mergedOperation, {
      $pull: { foo: { $in: ["1", "2"] } },
    });
  });
  it("merges $pull operands with same $eq query operators", () => {
    const op1 = { $pull: { foo: { $eq: "1" } } };
    const op2 = { $pull: { foo: { $eq: "1" } } };
    assert.deepStrictEqual(mergeUpdateOperations(op1, op2), {
      $pull: { foo: { $eq: "1" } },
    });
    const op3 = { $pull: { foo: { $eq: { first: "John" } } } };
    const op4 = { $pull: { foo: { $eq: { first: "John" } } } };
    assert.deepStrictEqual(mergeUpdateOperations(op3, op4), {
      $pull: { foo: { $eq: { first: "John" } } },
    });
  });
  it("merges $pull operands with $eq and $in query operators", () => {
    const op1 = { $pull: { foo: { $eq: "1" } } };
    const op2 = { $pull: { foo: { $in: ["2", "3"] } } };
    assert.deepStrictEqual(mergeUpdateOperations(op1, op2), {
      $pull: { foo: { $in: ["1", "2", "3"] } },
    });
    assert.deepStrictEqual(mergeUpdateOperations(op2, op1), {
      $pull: { foo: { $in: ["2", "3", "1"] } },
    });
  });
  it("merges $pull operands with $in and overlapped $eq query operators", () => {
    const op1 = { $pull: { foo: { $eq: "1" } } };
    const op2 = { $pull: { foo: { $in: ["1", "2"] } } };
    assert.deepStrictEqual(mergeUpdateOperations(op1, op2), {
      $pull: { foo: { $in: ["1", "2"] } },
    });
    assert.deepStrictEqual(mergeUpdateOperations(op2, op1), {
      $pull: { foo: { $in: ["1", "2"] } },
    });
    const op3 = { $pull: { foo: { $eq: { first: "John" } } } };
    const op4 = { $pull: { foo: { $in: [{ first: "John" }, "2"] } } };
    assert.deepStrictEqual(mergeUpdateOperations(op3, op4), {
      $pull: { foo: { $in: [{ first: "John" }, "2"] } },
    });
    assert.deepStrictEqual(mergeUpdateOperations(op4, op3), {
      $pull: { foo: { $in: [{ first: "John" }, "2"] } },
    });
  });
  it("merges $pull operands with $eq and $in query operators", () => {
    const op1 = { $pull: { foo: { $eq: "1" } } };
    const op2 = { $pull: { foo: { $in: ["2", "3"] } } };
    assert.deepStrictEqual(mergeUpdateOperations(op1, op2), {
      $pull: { foo: { $in: ["1", "2", "3"] } },
    });
    assert.deepStrictEqual(mergeUpdateOperations(op2, op1), {
      $pull: { foo: { $in: ["2", "3", "1"] } },
    });
  });
  it("merges $pull operands with $in query operators", () => {
    const op1 = { $pull: { foo: { $in: ["1", "2"] } } };
    const op2 = { $pull: { foo: { $in: ["3", "4"] } } };
    const op3 = { $pull: { foo: { $in: ["2", "3"] } } };
    assert.deepStrictEqual(mergeUpdateOperations(op1, op2), {
      $pull: { foo: { $in: ["1", "2", "3", "4"] } },
    });
    assert.deepStrictEqual(mergeUpdateOperations(op1, op3), {
      $pull: { foo: { $in: ["1", "2", "3"] } },
    });
  });
  it("merges $pull operands with different path", () => {
    const op1 = { $pull: { foo: { $eq: "1" } } };
    const op2 = { $pull: { bar: { $in: ["2", "3"] } } };
    const op3 = { $pull: { foo: { $eq: "2" }, bar: { $in: ["3", "4"] } } };
    assert.deepStrictEqual(mergeUpdateOperations(op1, op2), {
      $pull: { foo: { $eq: "1" }, bar: { $in: ["2", "3"] } },
    });
    assert.deepStrictEqual(mergeUpdateOperations(op1, op3), {
      $pull: { foo: { $in: ["1", "2"] }, bar: { $in: ["3", "4"] } },
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
