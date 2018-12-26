/* eslint-env mocha */
import { checkCondition, retrieve } from "../src/retriever";

import assert from "assert";
import { createDocumentPath } from "@sp2/format";

describe("retrieve() can retrieve objects", () => {
  const journal = {
    item: "journal",
    tag: "red",
    dim_cm: 14,
    nested: { id: 1 },
    "dot.notated": true,
  };
  const notebook = {
    item: "notebook",
    tag: "red",
    dim_cm: 21,
    nested: { id: 2 },
    "dot.notated": false,
  };
  const paper = {
    item: "paper",
    tag: "plain",
    dim_cm: 14,
    nested: { id: 3 },
    "dot.notated": true,
  };
  const planner = {
    item: "planner",
    tag: "red",
    dim_cm: 30,
    nested: { id: 4 },
    "dot.notated": false,
  };
  const postcard = {
    item: "postcard",
    tag: "blue",
    dim_cm: 10,
    nested: { id: 5 },
    "dot.notated": true,
  };
  const data: {
    item: string;
    tag: string;
    dim_cm: number;
    nested: { id: number };
    "dot.notated": boolean;
  }[] = [journal, notebook, paper, planner, postcard];

  describe("using $regex operator", () => {
    it("with $options operator", () => {
      const objs = ["John", "Mark", "Mary"].map(name => ({ name }));
      const retrieved = retrieve(objs, {
        name: { $regex: "[jy]", $options: "i" },
      });
      assert.deepStrictEqual(retrieved, [{ name: "John" }, { name: "Mary" }]);
    });
  });

  describe("using $eq operator which correctly compares operands with props", () => {
    it("when a single operation with non-nested docPath is given", () => {
      const operation = { tag: { $eq: "red" } };
      const retrieved = retrieve(data, operation);
      assert.deepStrictEqual(retrieved, [journal, notebook, planner]);
    });

    it("when multiple operations are given", () => {
      const operation = { tag: { $eq: "red" }, dim_cm: { $eq: 14 } };
      const retrieved = retrieve(data, operation);
      assert.deepStrictEqual(retrieved, [journal]);
    });

    it("when a single operation with nested docPath is given", () => {
      const operation = { tag: { $eq: "red" }, "nested.id": { $eq: 1 } };
      const retrieved = retrieve(data, operation);
      assert.deepStrictEqual(retrieved, [journal]);
    });

    it("when a single operation with docPath including dot is given", () => {
      const operation = {
        [createDocumentPath("dot.notated")]: { $eq: false },
      };
      const retrieved = retrieve(data, operation);
      assert.deepStrictEqual(retrieved, [notebook, planner]);
    });

    it("when multiple operations with docPath including dot and nested value are given", () => {
      const operation = {
        [createDocumentPath("dot.notated")]: { $eq: false },
        "nested.id": { $eq: 2 },
      };
      const retrieved = retrieve(data, operation);
      assert.deepStrictEqual(retrieved, [notebook]);
    });
  });

  describe("using $ne", () => {
    it("can retrieve objects with a value different from an operand", () => {
      const operation = { tag: { $ne: "red" } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["paper", "postcard"]);
    });
  });

  describe("$gt", () => {
    it("find items greater than condition", () => {
      const operation = { dim_cm: { $gt: 21 } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["planner"]);
    });
  });

  describe("$gte", () => {
    it("find items greater than or equal condition", () => {
      const operation = { dim_cm: { $gte: 21 } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["notebook", "planner"]);
    });
  });

  describe("$lt", () => {
    it("find items less than condition", () => {
      const operation = { dim_cm: { $lt: 14 } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["postcard"]);
    });
  });

  describe("$lte", () => {
    it("find items less than or equal condition", () => {
      const operation = { dim_cm: { $lte: 14 } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["journal", "paper", "postcard"]);
    });
  });

  describe("$in", () => {
    it("find items in condition", () => {
      const operation = { dim_cm: { $in: [10, 30] } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["planner", "postcard"]);
    });
  });

  describe("$nin", () => {
    it("find items not in condition", () => {
      const operation = { dim_cm: { $nin: [10, 30] } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["journal", "notebook", "paper"]);
    });
  });

  describe("an Array for an Element", () => {
    const data = [
      { item: "journal", tags: ["blank", "red"], dim_cm: [14, 21] },
      { item: "notebook", tags: ["red", "blank"], dim_cm: [14, 21] },
      { item: "paper", tags: ["red", "blank", "plain"], dim_cm: [14, 21] },
      { item: "planner", tags: ["blank", "red"], dim_cm: [22.85, 30] },
      { item: "postcard", tags: ["blue"], dim_cm: [10, 15.25] },
    ];

    describe("$eq", () => {
      it("find same array", () => {
        const operation = {
          tags: { $eq: ["red", "blank"] },
        };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["notebook"]);
      });

      it("find if the array field contains at least one element", () => {
        const operation = { tags: { $eq: "red" } };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, [
          "journal",
          "notebook",
          "paper",
          "planner",
        ]);
      });
    });

    describe("$ne", () => {
      it("find if the array field does not contain any element", () => {
        const operation = { tags: { $ne: "red" } };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["postcard"]);
      });
    });

    describe("$gt", () => {
      it("find if the array field contains at least one element", () => {
        const operation = { dim_cm: { $gt: 21 } };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["planner"]);
      });
    });

    describe("$gte", () => {
      it("find if the array field contains at least one element", () => {
        const operation = { dim_cm: { $gte: 21 } };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, [
          "journal",
          "notebook",
          "paper",
          "planner",
        ]);
      });
    });

    describe("$lt", () => {
      it("find if the array field contains at least one element", () => {
        const operation = { dim_cm: { $lt: 14 } };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["postcard"]);
      });
    });

    describe("$lte", () => {
      it("find if the array field contains at least one element", () => {
        const operation = { dim_cm: { $lte: 14 } };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, [
          "journal",
          "notebook",
          "paper",
          "postcard",
        ]);
      });
    });

    describe("$in", () => {
      it("find if the array field contains at least one element", () => {
        const operation = { tags: { $in: ["red"] } };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, [
          "journal",
          "notebook",
          "paper",
          "planner",
        ]);
      });

      it("find array by arry in array", () => {
        const operation = {
          tags: { $in: [["blank", "red"]] },
        };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["journal", "planner"]);
      });

      it("find array by arry and element", () => {
        const operation = {
          tags: { $in: [["blank", "red"], "blue"] },
        };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["journal", "planner", "postcard"]);
      });

      it("find nothing if $in is []", () => {
        const operation = { tags: { $in: [] } };
        const retrieved = retrieve(data, operation);
        assert(retrieved.length === 0);
      });
    });

    describe("$nin", () => {
      it("find if the array field does not contain any element", () => {
        const operation = { tags: { $nin: ["red"] } };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["postcard"]);
      });

      it("find array by arry in array", () => {
        const operation = {
          tags: { $nin: [["blank", "red"]] },
        };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["notebook", "paper", "postcard"]);
      });

      it("find array by arry and element", () => {
        const operation = {
          tags: { $nin: [["blank", "red"], "blue"] },
        };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["notebook", "paper"]);
      });

      it("find all if $nin is []", () => {
        const operation = { tags: { $nin: [] } };
        const retrieved = retrieve(data, operation);
        assert(retrieved.length === data.length);
      });
    });
  });
});

describe("checkCondition", () => {
  it("checks ", () => {
    assert(checkCondition("John", { $eq: "John" }));
  });
});
