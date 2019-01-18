# sp2
[![CircleCI](https://circleci.com/gh/phenyl-js/sp2/tree/master.svg?style=svg)](https://circleci.com/gh/phenyl-js/sp2/tree/master)

`sp2` is a set of JavaScript modules using syntax for **State-operating Procedures with Portability**.
Portability means that procedures are expressed by JSON data. This makes procedures portable and applicable over different environments.

This concept of "portable operation" is inspired by MongoDB. In fact, sp2 uses similar syntaxes as MongoDB's operations in its modules.

## @sp2/updater

`@sp2/updater` is an immutable updater of POJO using MongoDB's operator, with easier access to nested values.

```js
import { update } from "@sp2/updater";

const obj = {
  foo: 1,
  bar: { baz: "abc" },
};

const newObj = update(obj, {
  foo: 123,
  "bar.baz": "xyz",
});

assert(newObj !== obj); // obj is unchanged.
assert(newObj.foo === 123); // updated.
assert(newObj.bar.baz === "xyz"); // assigned nested value
```

See more usages [here]().

## @sp2/retriever

`@sp2/retriever` retrieves objects in an array using MongoDB-like Operations.

```js
import { retrieve } from "@sp2/retriever";

const objs = [{ name: "John" }, { name: "Naomi" }, { name: "Shin" }];

const retrievedObjs = retrieve(obj, { name: { $regex: /n$/ } });
assert.deepEqual(retrievedObjs, [{ name: "John" }, { name: "Shin" }]);
```

See more usages [here]().

## @sp2/format

`@sp2/format` provides type definitions of operations used by `sp2/updater` and `sp2/retriever`.
