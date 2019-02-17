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
    notebookOnly: 1,
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
    it("with a RegExp instance", () => {
      const objs = ["John", "Mark", "Mary"].map(name => ({ name }));
      const retrieved = retrieve(objs, {
        name: { $regex: /[jy]/i },
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
    it("can find items greater than condition", () => {
      const operation = { dim_cm: { $gt: 21 } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["planner"]);
    });
  });

  describe("$gte", () => {
    it("can find items greater than or equal condition", () => {
      const operation = { dim_cm: { $gte: 21 } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["notebook", "planner"]);
    });
  });

  describe("$lt", () => {
    it("can find items less than condition", () => {
      const operation = { dim_cm: { $lt: 14 } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["postcard"]);
    });
  });

  describe("$lte", () => {
    it("can find items less than or equal condition", () => {
      const operation = { dim_cm: { $lte: 14 } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["journal", "paper", "postcard"]);
    });
  });

  describe("$in", () => {
    it("can find items in condition", () => {
      const operation = { dim_cm: { $in: [10, 30] } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["planner", "postcard"]);
    });
  });

  describe("$nin", () => {
    it("can find items not in condition", () => {
      const operation = { dim_cm: { $nin: [10, 30] } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["journal", "notebook", "paper"]);
    });
  });

  describe("$not", () => {
    it("can find items which does not match the given condition", () => {
      const operation = { dim_cm: { $not: { $eq: 14 } } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["notebook", "planner", "postcard"]);
    });
  });

  describe("$exists", () => {
    it("can find items which contains non-null value of the given key", () => {
      const operation = { notebookOnly: { $exists: true } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, ["notebook"]);
    });

    it("can find items which contains null value of the given key when { $exist: false } is given", () => {
      const operation = { notebookOnly: { $exists: false } };
      const retrieved = retrieve(data, operation);
      const items = retrieved.map(f => f.item);
      assert.deepStrictEqual(items, [
        "journal",
        "paper",
        "planner",
        "postcard",
      ]);
    });
  });

  describe("$type", () => {
    it("can find items which matchs the given BSONTypeNumber", () => {
      const values = [{ foo: "bar" }, { foo: 123 }, { foo: true }];
      const BSONTYPE_STRING = 2;
      const operation = { foo: { $type: BSONTYPE_STRING } };
      const retrieved = retrieve(values, operation);
      assert.deepStrictEqual(retrieved, [{ foo: "bar" }]);
    });

    it("can find items which matchs the given BSONTypeString", () => {
      const values = [{ foo: "bar" }, { foo: 123 }, { foo: true }];
      const operation = { foo: { $type: "bool" } };
      const retrieved = retrieve(values, operation);
      assert.deepStrictEqual(retrieved, [{ foo: true }]);
    });
  });

  describe("$mod", () => {
    it("can find items whose remainder is the given remainder when divided by the given divider", () => {
      const values = [{ foo: 12 }, { foo: 13 }, { foo: 14 }];
      const operation = { foo: { $mod: [5, 4] } };
      const retrieved = retrieve(values, operation);
      assert.deepStrictEqual(retrieved, [{ foo: 14 }]);
    });
  });

  describe("$all", () => {
    it("can find items with array containing all the given elements", () => {
      const elems = [{ foo: 1 }, { foo: 2 }, { foo: 3 }];
      const [el1, el2, el3] = elems;
      const values = [
        { elems: [el1, el3, el2] },
        { elems: [el3, el2] },
        { elems: [el1, el2] },
        { elems: [el3, el2, el1, el3] },
        { elems: [el3, el3] },
      ];

      const operation = { elems: { $all: [el1, el2, el3] } };
      const retrieved = retrieve(values, operation);
      assert.deepStrictEqual(retrieved, [
        { elems: [el1, el3, el2] },
        { elems: [el3, el2, el1, el3] },
      ]);
    });
    it("cannot find items when non-array field is given", () => {
      const operation = { tag: { $all: ["red"] } };
      const retrieved = retrieve(data, operation);
      assert.deepStrictEqual(retrieved, []);
    });
  });

  describe("$elemMatch", () => {
    // see https://docs.mongodb.com/manual/reference/operator/query/elemMatch/
    it("can find items with array containing the matched elements with given condition when the value is non-object", () => {
      const scores = [{ results: [82, 85, 88] }, { results: [75, 88, 89] }];
      const operation = {
        results: { $elemMatch: { $gte: 80, $lt: 85 } },
      };
      const retrieved = retrieve(scores, operation);
      assert.deepStrictEqual(retrieved, [{ results: [82, 85, 88] }]);
    });

    it("can find items with array containing the matched elements with given condition when the value is object", () => {
      const surveys = [
        {
          results: [
            { product: "abc", score: 10 },
            { product: "xyz", score: 5 },
          ],
        },
        {
          results: [{ product: "abc", score: 8 }, { product: "xyz", score: 7 }],
        },
        {
          results: [{ product: "abc", score: 7 }, { product: "xyz", score: 8 }],
        },
      ];
      const operation = {
        results: { $elemMatch: { product: "xyz", score: { $gte: 8 } } },
      };
      const retrieved = retrieve(surveys, operation);
      assert.deepStrictEqual(retrieved, [
        {
          results: [{ product: "abc", score: 7 }, { product: "xyz", score: 8 }],
        },
      ]);
    });

    it("cannot find items when non-array field is given", () => {
      const operation = { tag: { $elemMatch: { $regex: /red/ } } };
      const retrieved = retrieve(data, operation);
      assert.deepStrictEqual(retrieved, []);
    });
  });

  describe("$size", () => {
    it("can find items with array of the given length", () => {
      const values = [
        { elems: ["foo"] },
        { elems: ["foo", "bar"] },
        { elems: ["foo", "bar", "baz"] },
      ];
      const operation = { elems: { $size: 2 } };
      const retrieved = retrieve(values, operation);
      assert.deepStrictEqual(retrieved, [{ elems: ["foo", "bar"] }]);
    });

    it("cannot find items when non-array field is given", () => {
      const operation = { tag: { $size: 3 } };
      const retrieved = retrieve(data, operation);
      assert.deepStrictEqual(retrieved, []);
    });
  });

  describe("other unimplemented operators", () => {
    it("throws an error when $text operator is given", () => {
      const operation = { tag: { $text: "" } };
      assert.throws(
        () => retrieve(data, operation),
        /"\$text" is currently unimplemented/
      );
    });
    it("throws an error when $where operator is given", () => {
      const operation = { tag: { $where: "" } };
      assert.throws(
        () => retrieve(data, operation),
        /"\$where" is currently unimplemented/
      );
    });
    it("throws an error when $geoIntersects operator is given", () => {
      const operation = { tag: { $geoIntersects: "" } };
      assert.throws(
        () => retrieve(data, operation),
        /"\$geoIntersects" is currently unimplemented/
      );
    });
    it("throws an error when $geoWithin operator is given", () => {
      const operation = { tag: { $geoWithin: "" } };
      assert.throws(
        () => retrieve(data, operation),
        /"\$geoWithin" is currently unimplemented/
      );
    });
    it("throws an error when $near operator is given", () => {
      const operation = { tag: { $near: "" } };
      assert.throws(
        () => retrieve(data, operation),
        /"\$near" is currently unimplemented/
      );
    });
    it("throws an error when $nearSphere operator is given", () => {
      const operation = { tag: { $nearSphere: "" } };
      assert.throws(
        () => retrieve(data, operation),
        /"\$nearSphere" is currently unimplemented/
      );
    });
    it("throws an error when $bitsAllClear operator is given", () => {
      const operation = { tag: { $bitsAllClear: "" } };
      assert.throws(
        () => retrieve(data, operation),
        /"\$bitsAllClear" is currently unimplemented/
      );
    });
    it("throws an error when $bitsAllSet operator is given", () => {
      const operation = { tag: { $bitsAllSet: "" } };
      assert.throws(
        () => retrieve(data, operation),
        /"\$bitsAllSet" is currently unimplemented/
      );
    });
    it("throws an error when $bitsAnyClear operator is given", () => {
      const operation = { tag: { $bitsAnyClear: "" } };
      assert.throws(
        () => retrieve(data, operation),
        /"\$bitsAnyClear" is currently unimplemented/
      );
    });
    it("throws an error when $bitsAnySet operator is given", () => {
      const operation = { tag: { $bitsAnySet: "" } };
      assert.throws(
        () => retrieve(data, operation),
        /"\$bitsAnySet" is currently unimplemented/
      );
    });
  });

  it("throws an error when invalid operator is given", () => {
    const operation = { tag: { $qe: "" } };
    assert.throws(() => retrieve(data, operation), /Unknown operator: "\$qe"/);
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
      it("can find same array", () => {
        const operation = {
          tags: { $eq: ["red", "blank"] },
        };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["notebook"]);
      });

      it("can find items when the array field contains at least one element", () => {
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
      it("can find items when the array field does not contain any element", () => {
        const operation = { tags: { $ne: "red" } };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["postcard"]);
      });
    });

    describe("$gt", () => {
      it("can find items when the array field contains at least one element", () => {
        const operation = { dim_cm: { $gt: 21 } };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["planner"]);
      });
    });

    describe("$gte", () => {
      it("can find items when the array field contains at least one element", () => {
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
      it("can find items when the array field contains at least one element", () => {
        const operation = { dim_cm: { $lt: 14 } };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["postcard"]);
      });
    });

    describe("$lte", () => {
      it("can find items when the array field contains at least one element", () => {
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
      it("can find items when the array field contains at least one element", () => {
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

      it("can find array by array in array", () => {
        const operation = {
          tags: { $in: [["blank", "red"]] },
        };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["journal", "planner"]);
      });

      it("can find array by array and element", () => {
        const operation = {
          tags: { $in: [["blank", "red"], "blue"] },
        };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["journal", "planner", "postcard"]);
      });

      it("can find nothing if $in is []", () => {
        const operation = { tags: { $in: [] } };
        const retrieved = retrieve(data, operation);
        assert(retrieved.length === 0);
      });
    });

    describe("$nin", () => {
      it("can find items when the array field does not contain any element", () => {
        const operation = { tags: { $nin: ["red"] } };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["postcard"]);
      });

      it("can find array by array in array", () => {
        const operation = {
          tags: { $nin: [["blank", "red"]] },
        };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["notebook", "paper", "postcard"]);
      });

      it("can find array by array and element", () => {
        const operation = {
          tags: { $nin: [["blank", "red"], "blue"] },
        };
        const retrieved = retrieve(data, operation);
        const items = retrieved.map(f => f.item);
        assert.deepStrictEqual(items, ["notebook", "paper"]);
      });

      it("can find all if $nin is []", () => {
        const operation = { tags: { $nin: [] } };
        const retrieved = retrieve(data, operation);
        assert(retrieved.length === data.length);
      });
    });
  });

  it("using $and operator", () => {
    const objs = ["John", "Mark", "Mary"].map(name => ({ name }));
    const retrieved = retrieve(objs, {
      $and: [
        { name: { $regex: "[jy]", $options: "i" } },
        { name: { $not: { $eq: "Mary" } } },
      ],
    });
    assert.deepStrictEqual(retrieved, [{ name: "John" }]);
  });

  it("using $nor operator", () => {
    const objs = ["John", "Mark", "Mary"].map(name => ({ name }));
    const retrieved = retrieve(objs, {
      $nor: [
        { name: { $regex: "[jy]", $options: "i" } },
        { name: { $eq: "Mary" } },
      ],
    });
    assert.deepStrictEqual(retrieved, [{ name: "Mark" }]);
  });

  it("using $or operator", () => {
    const objs = ["John", "Mark", "Mary"].map(name => ({ name }));
    const retrieved = retrieve(objs, {
      $or: [
        { name: { $regex: "[jy]", $options: "i" } },
        { name: { $eq: "Mark" } },
      ],
    });
    assert.deepStrictEqual(retrieved, [
      { name: "John" },
      { name: "Mary" },
      { name: "Mark" },
    ]);
  });
});

describe("checkCondition", () => {
  it("checks ", () => {
    assert(checkCondition("John", { $eq: "John" }));
  });
});
