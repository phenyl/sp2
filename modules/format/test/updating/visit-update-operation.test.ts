/* eslint-env mocha */

import assert from "assert";
import { visitUpdateOperation } from "../../src/updating/visit-update-operation";

describe("visitUpdateOperation", () => {
  describe("when whole operation handler is passed", () => {
    it("visits all the operations", () => {
      const operators: string[] = [];
      const updateOperation = {
        $set: { "name.first": "John" },
        $push: { hobbies: "tennis" },
        $unset: { unnecessaryProp: "" },
      };
      visitUpdateOperation(updateOperation, {
        operation: (operand, operator) => {
          operators.push(operator);
          return operand;
        },
      });
      assert.deepStrictEqual(operators, ["$set", "$push", "$unset"]);
    });
  });

  describe("when operator-specific handler is passed", () => {
    it("visits once for each specific operator", () => {
      let visitedCount = 0;
      const updateOperation = {
        $set: { "name.first": "John" },
        $push: { hobbies: "tennis" },
        $unset: { unnecessaryProp: "" },
      };
      visitUpdateOperation(updateOperation, {
        $set: operand => {
          visitedCount++;
          return operand;
        },
        $push: operand => {
          visitedCount++;
          return operand;
        },
        $unset: operand => {
          visitedCount++;
          return operand;
        },
      });
      assert.equal(visitedCount, 3);
    });
  });
});
