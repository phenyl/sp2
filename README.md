# sp2 - Immutable updater of objects using JSON operation

[![Github Workflow](https://github.com/phenyl/sp2/workflows/Build/badge.svg)](https://github.com/phenyl/sp2/actions)
[![Coverage Status](https://coveralls.io/repos/github/phenyl/sp2/badge.svg?branch=master)](https://coveralls.io/github/phenyl/sp2?branch=master)
[![npm version](https://img.shields.io/npm/v/sp2.svg?style=flat)](https://www.npmjs.com/package/sp2)
![types](https://img.shields.io/npm/types/sp2.svg?style=flat)
![npm downloads](https://img.shields.io/npm/dm/@sp2/updater.svg?style=flat)
![license](https://img.shields.io/npm/l/sp2.svg?style=flat)

`sp2` is an immutable updater of objects using JSON operation.
Suitable for flux state transition like [Redux](https://redux.js.org).

```js
// JSON operation
const operation = { $set: { "foo.bar": "baz" } };
```

The description of operation is almost the same format as [MongoDB's Update Operators](https://docs.mongodb.com/manual/reference/operator/update/).

Then, update Object by the operation without mutation.

```js
const obj = { foo: { bar: "xx" } };
const newObj = update(obj, operation);
```

---

## Features

- **Pure objects**. No extension like `new ImmutableMap()`.
- **Easy to immutably update nested values** in objects. No `{ ...obj }`.
- **Strong Type Support** with [TypeScript](http://typescriptlang.org). Nested paths can be typed.
- **Portable**. Operations can be queued, stored, and sent to other environments.
- **Mergable**. Multiple operations can be merged into one operation.
- **Similar format to [MongoDB's Update Operators](https://docs.mongodb.com/manual/reference/operator/update/)**. It's worth remembering.
- **Various operators**: `$push`, `$inc`, `$unset`, etc...
- **Class instance support**: it can restore instance when it's restorable.

The name "sp2" is derived from the name of orbital of chemical bond used in phenyl group. This was once a core function of [Phenyl](https://github.com/phenyl/phenyl) framework and extracted from the library.
Another meaning of "sp2" is **S**tate-operating **P**rocedures with **P**ortability.
Portability means that procedures are expressed by JSON data. This makes procedures portable and applicable over different environments.

---

## Installation

```sh
npm install sp2
```

```sh
yarn add sp2
```

---

## Example

```js
import { update } from "sp2";

const person = {
  name: { first: "Smith", last: "Doe" },
  age: 32,
};

const operation = { $set: { "name.first": "John" } };

const updatedPerson = update(person, operation);
updatedPerson.name.first; // John

assert(updatedPerson !== person); // obj is unchanged.
assert(updatedPerson.age === 32); // unchanged.
assert(updatedPerson.name.first === "John"); // updated.
assert(updatedPerson.name.last === "Doe"); // unchanged.
```

### More powerful types with TypeScript

With TypeScript, `sp2` can infer the types of nested properties and values.
To do so, prepare a type and operation-creating functions using `$bind<T>()` like the following example.

```ts
import { $bind, update } from "sp2";

// target object type
type Person = {
  name: { first: string; last: string };
  age: number;
};

const { $set, $path } = $bind<Person>(); // Inject the type and generate operation-creating functions.

const operation = $set($path("name", "first"), "John");
```

`sp2` provides property names of the target object type during writing codes.
![demo01](https://user-images.githubusercontent.com/196333/51425391-e6e6e900-1c1e-11e9-8a23-bc3557f00ade.gif)

Then, just put the `operation` to `update()` function.

```ts
const operation = $set($path("name", "first"), "John");

const updatedPerson = update(person, operation);

assert(operation = { $set: { "name.first": "John" } });
assert(updatedPerson !== person); // obj is unchanged.
assert(updatedPerson.age === 32); // unchanged.
assert(updatedPerson.name.first === "John"); // updated.
assert(updatedPerson.name.last === "Doe"); // unchanged.

`sp2` can infer the return value of `update()` (`Person` type here).
```

![demo02](https://user-images.githubusercontent.com/196333/51425384-c028b280-1c1e-11e9-92b3-c5f24b322b9b.gif)

### Redux Reducer

TBD

### Integration with MongoDB using Phenyl

TBD

# API Documentation

## Definitions

```js
const operation = {
  $set: { "foo.bar[0].baz": 123 },
/*^^^^
  UpdateOperator
          ^^^^^^^^^^^^^^^^
            DocumentPath
                            ^^^
                         UpdateOperandValue
        ^^^^^^^^^^^^^^^^^^^^^^^^^
          UpdateOperand
  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         UpdateOperation
};
*/
```

- `operation` value is **UpdateOperation**.
- `$set` is **UpdateOperator**.
- `{ 'foo.bar[0].baz': 123 }` is **UpdateOperand**. In the example, it's **SetOperand**.
- `foo.bar[0].baz` is **DocumentPath**.
- `123` is **UpdateOperandValue**.

### DocumentPath

`DocumentPath` expresses location to nested value.
It's the same format as [Amazon DynamoDB's DocumentPath](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.Attributes.html#Expressions.Attributes.NestedElements.DocumentPathExamples) and similar to `MongoDB`.

```js
{
  foo: {
    arr: [{ bar: "baz" }];
  }
}
```

The string `'baz'` is expressed as `'foo.arr[0].bar'` in DocumentPath format.

This DocumentPath is slightly different from [Dot Notation in MongoDB](https://docs.mongodb.com/manual/core/document/#dot-notation) which expresses `'baz'` as `'foo.arr.0.bar'` (array index expression is different).

## update(obj, ...operations)

Update object following the given operation(s).

```js
update(
  obj: Object,
  ...operations: <SetOperand | UpdateOperation>[]
): Object
```

### Parameters

#### obj

Object to be copied and updated new values. Note that **obj is unchanged after the call**.
Unchanged values are shallowly copied to the returned object.

```js
import { update } from "sp2";
const obj = { foo: { bar: 1 }, baz: { biz: 2 } };
const newObj = update(obj, { "baz.biz": 3 });
assert(obj.foo === newObj.foo); // unchanged values are shallowly copied
assert(obj.baz !== newObj.baz); // changed values are not copied
```

#### operations (variable arguments)

**UpdateOperation**, **SetOperand**.
SetOperand is just a key-value pair object.

All the operations are fulfilled in order.

```js
update(obj, operation1)
// operations are applied in order: 1, 2, 3...
update(obj, operation1, operation1, operation2, operation3, ...)
```

## updateProp(obj, docPath, ...operations)

Update the property of the obj located at the given documentPath following the given operation.

```js
updateProp(
  obj: Object,
  docPath: DocumentPath,
  uOp: SetOperand | UpdateOperation
): Object
```

### Parameters

#### obj

Object containing an object to be updated. Note that **obj is unchanged after the call**.

#### operations

**UpdateOperation** or **SetOperand**.
See update() API docs.

### Example

```js
import { updateProp } from "sp2";
const obj = { foo: { bar: 1 }, baz: { biz: 2 } };
const newObj = updateProp(obj, "baz", { $inc: { biz: 1 } });

assert(newObj.baz.biz === 3);
```

## retarget(docPath, operation)

Retarget the given UpdateOperation to the given docPath.

It helps realize loose coupling between parent object and child Object.
Even if a parent-object-handling layer doesn't know its child object's shape,
the layer can create an UpdateOperation to modify its child object using `retarget()`
if only child-object-handling layer offers the child object's UpdateOperation.

```js
retarget(
  docPath: DocumentPath,
  operation: SetOperand | UpdateOperation
): UpdateOperation
```

### Parameters

#### docPath

DocumentPath of the new target object (target itself is not given).

#### operation

**UpdateOperation** or **SetOperand**.
operation to be modified. Note that operation itself is unchanged.
New operation object is returned.

### Example

```js
import { retarget, update } from "sp2";
const parent = { child: { foo: { bar: 123 } } };
const childOp = { $mul: { "foo.bar": 2 } };
const parentOp = retarget(parent, "child", childOp);

const newParent = update(parent, parentOp);
assert.deepEqual(parentOp, { $mul: { "child.foo.bar": 2 } });
assert(newParent.child.foo.bar === 246);
```

## updateAndRestore()

Assign new values and create a new instance of the original class ( = Restoration).

```js
updateAndRestore<T: Restorable>(
  obj: T,
  uOp: SetOperand | UpdateOperation | <SetOperand | UpdateOperation>[]
): T
```

obj must be **Restorable**.

### What is "Restorable"?

Restorable is a characteristic of JavaScript class instances which meets the following requirement.

```js
const jsonStr = JSON.stringify(instance);
const plain = JSON.parse(jsonStr);
const newInstance = new TheClass(plain);

assert.deepEqual(newInstance, instance);
```

Roughly, Restorable object is an instance which can re-created by passing its JSON object to the class constructor.

See [is-restorable](https://github.com/phenyl/phenyl/tree/master/modules/is-restorable) module for more detail.

### Parameters

#### obj

A **Restorable** instance.

#### uOp

**UpdateOperation** or **SetOperand**.
See update() API docs.

### Example

```js
class Name {
  constructor(params) {
    this.first = params.first;
    this.last = params.last;
  }
}

class Person {
  constructor(params) {
    this.name = new Name(params.name);
    this.age = params.age;
  }
}
const person = new Person({
  name: { first: "Shin", last: "Suzuki" },
  age: 21,
});

const personWithRealAge = updateAndRestore(person, { $inc: { age: 10 } });
assert(personWithRealAge instanceof Person);
assert(personWithRealAge.name instanceof Name);
assert(personWithRealAge.age === 31);
```

## updatePropAndRestore()

The same arguments as `updateProp()` but it also restores the original object.

## toJSON()

Convert UpdateOperation to Restorable JSON format.

```js
import { toJSON } from "sp2";
class Name {
  constructor(params) {
    this.first = params.first;
    this.last = params.last;
  }
}

const person = { name: new Name({ first: "Shin", last: "Suzuki" }) };
const op = { $restore: { name: Name }, $set: { "name.first": "Shun" } };
assert.deepEqual(JSON.parse(JSON.stringify(op)).$restore.name, {}); // classes re converted to {} over serialization
assert.deepEqual(JSON.parse(JSON.stringify(toJSON(op))).$restore.name, "");
```

## mergeOperations()

**[Experimental]** Merge UpdateOperations into one UpdateOperation.

```js
import { mergeOperations } from "sp2";
const merged = mergeOperations({ $set: { foo: 123 } }, { $inc: { count: 1 } });
assert.deepEqual(merged, {
  $set: { foo: 123 },
  $inc: { count: 1 },
});
```

## normalizeOperation()

Convert SetOperand to normalized operation.

```js
import { normalizeOperation } from 'sp2'
const op = { 'baz.biz': 3 })
assert.deepEqual(normalizeOperation(op), { $set: { 'baz.biz': 3 } })
```

## Update Operators

Almost the same as **[MongoDB's Update Operators](https://docs.mongodb.com/manual/reference/operator/update/)**.

### \$inc

An operator to increment number values.

```js
const value = update({ a: 10, b: 100 }, { $inc: { a: 2, b: -3 } });
assert(value.a === 12);
assert(value.b === 97);
```

### \$set

An operator to set values.

```js
const value = update({ a: "foo", b: 100 }, { $set: { a: "bar", b: 101 } });
assert(value.a === "bar");
assert(value.b === 101);
```

$set operator can be omitted when the whole operation is$set.

```js
const value = update({ a: "foo", b: 100 }, { a: "bar", b: 101 });
```

### \$min

An operator to compare the existing value with the given operand and set smaller one.

```js
const value = update({ a: 10, b: 100 }, { $min: { a: 8, b: 101 } });
assert(value.a === 8);
assert(value.b === 100);
```

### \$max

An operator to compare the existing value with the given operand and set greater one.

```js
const value = update({ a: 10, b: 100 }, { $max: { a: 8, b: 101 } });
assert(value.a === 10);
assert(value.b === 101);
```

### \$mul

An operator to multiply number values.

```js
const value = update({ a: 10, b: 100 }, { $mul: { a: 2, b: 0 } });
assert(value.a === 20);
assert(value.b === 0);
```

### \$addToSet

An operator to add element(s) to array values when the same value(s) doesn't exist.

```js
const value = update(
  { arr: [{ a: 1 }, { a: 88 }] },
  { $addToSet: { arr: { a: 3 } } }
);
assert.deepEqual(value.arr, [{ a: 1 }, { a: 88 }, { a: 3 }]);
```

`$each` modifier can be available like MongoDB.

```js
const value = update(
  { arr: [{ a: 1 }, { a: 88 }] },
  { $addToSet: { arr: { $each: [{ a: 1 }, { a: 3 }, { a: 5 }] } } }
);
assert.deepEqual(value.arr, [{ a: 1 }, { a: 88 }, { a: 3 }, { a: 5 }]);
```

### \$pop

An operator to pop/shift an element from array values.

Pop:

```js
const obj = { categories: ["fashion", "news", "cooking-recipes"] };
const newObj = update(obj, { $pop: { categories: 1 } });
assert.deepEqual(newObj.categories, ["fashion", "news"]);
```

Shift:

```js
const obj = { categories: ["fashion", "news", "cooking-recipes"] };
const newObj = update(obj, { $pop: { categories: -1 } });
assert.deepEqual(newObj.categories, ["news", "cooking-recipes"]);
```

### \$pull

An operator to remove elements in array matching the given condition.
For all condition definitions, see [mongolike-operations/find-operation.js.flow](https://github.com/phenyl/phenyl/blob/master/modules/mongolike-operations/decls/query-condition.js.flow).

They are almost compatible with [MongoDB's Query Operators](https://docs.mongodb.com/manual/reference/operator/query/).

```js
type PullOperator = { [field: DocumentPath]: QueryCondition | EqCondition };
// type QueryCondition => See the link above.
type EqCondition = Object | Array<Basic> | string | number | boolean;
```

```js
const obj = { categories: ["fashion", "news", "cooking-recipes"] };
const newObj = update(obj, { $pull: { categories: { $regex: /fash/ } } });
assert.deepEqual(newObj.categories, ["news", "cooking-recipes"]);
```

### \$push

An operator to add/sort/slice/splice element(s) to array values.

Add a value:

```js
const obj = { users: [{ id: "user1" }, { id: "user2" }, { id: "user3" }] };

const newObj = update(obj, { $push: { users: { id: "user4" } } });

assert.deepEqual(newObj, {
  users: [{ id: "user1" }, { id: "user2" }, { id: "user3" }, { id: "user4" }],
});
```

Add values:

```js
const obj = { users: [{ id: "user1" }, { id: "user2" }, { id: "user3" }] };
const newObj = update(obj, {
  $push: {
    users: { $each: [{ id: "user4" }, { id: "user5" }, { id: "user6" }] },
  },
});

assert.deepEqual(newObj, {
  users: [
    { id: "user1" },
    { id: "user2" },
    { id: "user3" },
    { id: "user4" },
    { id: "user5" },
    { id: "user6" },
  ],
});
```

Add values to the specific position:

```js
const obj = { users: [{ id: "user1" }, { id: "user2" }, { id: "user3" }] };
const newObj = update(obj, {
  $push: {
    users: {
      $each: [{ id: "user4" }, { id: "user5" }, { id: "user6" }],
      $position: 1,
    },
  },
});
assert.deepEqual(newObj, {
  users: [
    { id: "user1" },
    { id: "user4" },
    { id: "user5" },
    { id: "user6" },
    { id: "user2" },
    { id: "user3" },
  ],
});
```

Sort values:

```js
const obj = {
  users: [
    { id: "user2", age: 31 },
    { id: "user4", age: 35 },
    { id: "user6", age: 24 },
  ],
};

const newObj = update(obj, {
  $push: {
    users: {
      $each: [
        { id: "user1", age: 36 },
        { id: "user3", age: 31 },
        { id: "user5", age: 37 },
      ],
      $sort: { age: -1, id: 1 },
    },
  },
});
assert.deepEqual(newObj, {
  users: [
    { id: "user5", age: 37 },
    { id: "user1", age: 36 },
    { id: "user4", age: 35 },
    { id: "user2", age: 31 },
    { id: "user3", age: 31 },
    { id: "user6", age: 24 },
  ],
});
```

Slice values:

```js
const obj = { users: [{ id: "user2" }, { id: "user4" }, { id: "user6" }] };
const newObj = update(obj, {
  $push: {
    users: {
      $each: [{ id: "user1" }, { id: "user3" }, { id: "user5" }],
      $slice: 3,
      $sort: { id: -1 },
    },
  },
});

assert.deepEqual(newObj, {
  users: [{ id: "user6" }, { id: "user5" }, { id: "user4" }],
});
```

Slice with negative number:

```js
const obj = { users: [{ id: "user2" }, { id: "user4" }, { id: "user6" }] };
const newObj = update(obj, {
  $push: {
    users: {
      $each: [{ id: "user1" }, { id: "user3" }, { id: "user5" }],
      $slice: -4,
    },
  },
});
assert.deepEqual(newObj, {
  users: [{ id: "user6" }, { id: "user1" }, { id: "user3" }, { id: "user5" }],
});
```

### \$bit

An operator to execute bitwise operations.

```js
const obj = { flags: parseInt("1010", 10) };
const newObj = update(obj, { $bit: { flags: { and: parseInt("0101", 10) } } });
assert(newObj.flags.toString(2) === "1100000");
```

### \$unset

An operator to remove values.

```js
const obj = {
  categories: ["fashion", "news", "cooking-recipes"],
  name: { first: "Shin", last: "Suzuki" },
};
const newObj = update(obj, {
  $unset: { "categories[1]": "", "name.last": "" },
});
assert.deepEqual(newObj, {
  categories: ["fashion", null, "cooking-recipes"],
  name: { first: "Shin" },
});
```

### \$rename

An operator to rename field names.

```js
const obj = {
  ttle: "October",
  names: [{ first: "Shin", lsat: "Suzuki" }],
};
const newObj = update(obj, {
  $rename: {
    ttle: "title",
    "names[0].lsat": "last",
    "names[0].nonExistingField": "abc", // no effect with non-existing field
  },
});
assert.deepEqual(newObj, {
  title: "October",
  names: [{ first: "Shin", last: "Suzuki" }],
});
```

Note that this operator is a bit different from [MongoDB's \$rename operator](https://docs.mongodb.com/manual/reference/operator/update/rename/).

The operands are not 'Dot Notation' but field names.
The following sample object in MongoDB

```js
{ $rename: { "name.first": "name.fname" } }
```

will be the following object in sp2.

```js
{ $rename: { "name.first": "fname" } }
```

See that the value doesn't contain `"name"`.

### \$restore

An operator to construct instance of the given path.
New operator, **Not defined at MongoDB**.

```js
type RestoreOperator = {
  [field: DocumentPath]: "" | Class<Restorable>,
};
```

Example:

```js
const user = new User({
  id: "user1",
  name: { first: "Shin", last: "Suzuki" },
  age: { value: 31 },
});
const newUser = update(user, {
  $inc: { "age.value": 1 },
  $set: {
    id: "user001",
    "name.first": "Shinji",
    name2: { first: "Shinzo", last: "Sasaki" },
  },
  $restore: { name: "", name2: Name, age: Age },
});

const expectedNewUser = {
  id: "user001",
  name: new Name({ first: "Shinji", last: "Suzuki" }),
  name2: new Name({ first: "Shinzo", last: "Sasaki" }),
  age: new Age({ value: 32 }),
};
assert(newUser.name instanceof Name);
assert(newUser.name2 instanceof Name);
assert(newUser.age instanceof Age);
assert.deepEqual(newUser, expectedNewUser);
```

Once `RestoreOperator` is JSON.stringify-ed, the fields with `Class<Restorable>` will be removed.
To avoid this, you can choose two alternatives.

1. Implement static method `toJSON()` to classes.

```js
class Foo {
  static toJSON() {
    return "";
  }
}
```

2. Use `updateOperationToJSON()` function from `oad-utils`

```js
import { updateOperationToJSON } from "oad-utils";
const operation = { $restore: { foo: Foo } };
JSON.stringify(updateOperationToJSON(operation)); // {"$restore":{"foo":""}}
```

[oad-utils](https://github.com/phenyl/phenyl/blob/master/modules/oad-utils) is also one of Phenyl family offering OAD-related utility functions.

# LICENSE

Apache License 2.0
