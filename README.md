# typescript-extended-linq

This is a library that is a direct translation of [System.Linq](https://docs.microsoft.com/en-us/dotnet/api/system.linq) from .NET and many additional functions from [MoreLINQ](https://github.com/morelinq/MoreLINQ).

## Installation:

```typescript
npm i typescript-extended-linq
```

## Why use this LRU Cache?

### Additional Functionality

- Native JavaScript/TypeScript provides many useful functions that are similar to LINQ (such as map, filter, reduce, etc). This library fills in the missing gaps with many functions that are not included in the native language such as joins, multi-level ordering, grouping, etc.

### Deferred Execution

- Just like LINQ, this library uses [deferred execution and lazy evaluation](https://docs.microsoft.com/en-us/dotnet/standard/linq/deferred-execution-lazy-evaluation).

### TypeScript First

- This library was written in Typescript so type definitions are included out of the box and are always up to date. The Typescript source code is included in the package so users can easily look at the implementation.
- [Documentation](https://rob893.github.io/typescript-extended-linq/) is also auto-generated on every release so they will always be up to date as well.

## Documentation

Please see full documentation [here](https://rob893.github.io/typescript-extended-linq/).

## Basic Usage:

```typescript
import { from } from 'typescript-extended-linq';

const items = [
  { id: 1, foo: 'a', bar: new Date('8/1/2021') },
  { id: 2, foo: 'a', bar: new Date('8/1/2021') },
  { id: 2, foo: 'b', bar: new Date('8/1/2021') },
  { id: 2, foo: 'a', bar: new Date('9/1/2021') },
  { id: 3, foo: 'a', bar: new Date('8/1/2021') },
  { id: 3, foo: 'b', bar: new Date('8/1/2021') }
];

const query = from(items)
  .where(item => item.id % 2 === 0)
  .orderBy(item => item.id)
  .thenBy(item => item.foo)
  .thenBy(item => item.bar);

/**
 * Will log:
 * [
 *  { id: 2, foo: 'a', bar: 2021-08-01T07:00:00.000Z },
 *  { id: 2, foo: 'a', bar: 2021-09-01T07:00:00.000Z },
 *  { id: 2, foo: 'b', bar: 2021-08-01T07:00:00.000Z }
 * ]
 */
console.log(query.toArray());

const sumOfIds = query.sum(item => item.id);

// Will log 6
console.log(sumOfIds);

const distinct = query.distinctBy(item => item.id).toArray();

// Will log [ { id: 2, foo: 'a', bar: 2021-08-01T07:00:00.000Z } ]
console.log(distinct);
```
