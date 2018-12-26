/* eslint-env mocha */

import {
  AndFindOperation,
  FindOperation,
  NorFindOperation,
  OrFindOperation,
  SimpleFindOperation,
} from "../../src/retrieving/find-operation";

import { QueryCondition } from "../../src/retrieving/query-condition";
import assert from "assert";
import { visitFindOperation } from "../../src/retrieving/visit-find-operation";

describe("visitFindOperation", () => {
  describe("when simpleFindOperation handler is passed", () => {
    it("visits all the SimpleFindOperations through AndFindOperation", () => {
      const visited: SimpleFindOperation[] = [];
      const findOperation: AndFindOperation = {
        $and: [
          { "name.first": { $regex: /^J/ } },
          { age: { $gt: 19 } },
          { age: { $lt: 40 } },
        ],
      };
      visitFindOperation(findOperation, {
        simpleFindOperation: (simpleOperation: SimpleFindOperation) => {
          visited.push(simpleOperation);
          return simpleOperation;
        },
      });
      assert(visited.length === 3);
    });

    it("visits all the SimpleFindOperations through OrFindOperation", () => {
      const visited: SimpleFindOperation[] = [];
      const findOperation: OrFindOperation = {
        $or: [
          { "name.first": { $regex: /^J/ } },
          { age: { $gt: 19 } },
          { age: { $lt: 40 } },
        ],
      };
      visitFindOperation(findOperation, {
        simpleFindOperation: (simpleOperation: SimpleFindOperation) => {
          visited.push(simpleOperation);
          return simpleOperation;
        },
      });
      assert(visited.length === 3);
    });

    it("visits all the SimpleFindOperations through NorFindOperation", () => {
      const visited: SimpleFindOperation[] = [];
      const findOperation: NorFindOperation = {
        $nor: [
          { "name.first": { $regex: /^J/ } },
          { age: { $gt: 19 } },
          { age: { $lt: 40 } },
        ],
      };
      visitFindOperation(findOperation, {
        simpleFindOperation: (simpleOperation: SimpleFindOperation) => {
          visited.push(simpleOperation);
          return simpleOperation;
        },
      });
      assert(visited.length === 3);
    });

    it("visits once toward SimpleFindOperation", () => {
      const visited: SimpleFindOperation[] = [];
      const findOperation: SimpleFindOperation = {
        "name.first": { $regex: /^J/ },
      };

      visitFindOperation(findOperation, {
        simpleFindOperation: (simpleOperation: SimpleFindOperation) => {
          visited.push(simpleOperation);
          return simpleOperation;
        },
      });
      assert(visited.length === 1);
    });

    it("visits only '$and' property when '$and' and '$or' exist", () => {
      const visited: SimpleFindOperation[] = [];
      const findOperation: FindOperation = {
        $and: [
          { "name.first": { $regex: /^J/ } },
          { age: { $gt: 19 } },
          { age: { $lt: 40 } },
        ],
        $or: [{ "name.first": { $regex: /^J/ } }],
      };
      const result = visitFindOperation(findOperation, {
        simpleFindOperation: (simpleOperation: SimpleFindOperation) => {
          visited.push(simpleOperation);
          return simpleOperation;
        },
      });
      assert(visited.length === 3);
      // @ts-ignore
      assert(result.$and != null);
      // @ts-ignore
      assert(result.$or == null);
    });

    it("visits only '$and' property when '$and' and '$nor' exist", () => {
      const visited: SimpleFindOperation[] = [];
      const findOperation: FindOperation = {
        $and: [
          { "name.first": { $regex: /^J/ } },
          { age: { $gt: 19 } },
          { age: { $lt: 40 } },
        ],
        $nor: [{ "name.first": { $regex: /^J/ } }],
      };
      const result = visitFindOperation(findOperation, {
        simpleFindOperation: (simpleOperation: SimpleFindOperation) => {
          visited.push(simpleOperation);
          return simpleOperation;
        },
      });
      assert(visited.length === 3);
      // @ts-ignore
      assert(result.$and != null);
      // @ts-ignore
      assert(result.$nor == null);
    });
    it("visits only '$nor' property when '$nor' and '$or' exist", () => {
      const visited: SimpleFindOperation[] = [];
      const findOperation: FindOperation = {
        $nor: [
          { "name.first": { $regex: /^J/ } },
          { age: { $gt: 19 } },
          { age: { $lt: 40 } },
        ],
        $or: [{ "name.first": { $regex: /^J/ } }],
      };
      const result = visitFindOperation(findOperation, {
        simpleFindOperation: (simpleOperation: SimpleFindOperation) => {
          visited.push(simpleOperation);
          return simpleOperation;
        },
      });
      assert(visited.length === 3);
      // @ts-ignore
      assert(result.$nor != null);
      // @ts-ignore
      assert(result.$or == null);
    });
  });
  describe("when queryCondition handler is passed", () => {
    it("visits all the QueryConditions through AndFindOperation", () => {
      const visited: QueryCondition[] = [];
      const findOperation: AndFindOperation = {
        $and: [
          { "name.first": { $regex: /^J/ }, "name.last": { $exists: true } },
          { age: { $gt: 19 } },
          { age: { $lt: 40 } },
        ],
      };
      visitFindOperation(findOperation, {
        queryCondition: (queryCondition: QueryCondition) => {
          visited.push(queryCondition);
          return queryCondition;
        },
      });
      assert(visited.length === 4);
    });
  });
});
