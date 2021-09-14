# typescript-extended-linq

This is a library that is a direct translation of [System.Linq](https://docs.microsoft.com/en-us/dotnet/api/system.linq) from .NET and many additional functions from [MoreLINQ](https://github.com/morelinq/MoreLINQ).

## Table of Contents

1. [Installation](#installation)
2. [Why use this library?](#why-use-this-library)
3. [Basic Usage](#basic-usage)
4. [Documentation](#documentation)

## Installation:

```typescript
npm i typescript-extended-linq
```

## Why use this library?

### Additional Functionality

- Native JavaScript/TypeScript provides many useful functions that are similar to LINQ (such as map, filter, reduce, etc). This library fills in the missing gaps with many functions that are not included in the native language such as joins, multi-level ordering, grouping, etc.

### Deferred Execution

- Just like LINQ, this library uses [deferred execution and lazy evaluation](https://docs.microsoft.com/en-us/dotnet/standard/linq/deferred-execution-lazy-evaluation).

### TypeScript First

- This library was written in Typescript so type definitions are included out of the box and are always up to date. The Typescript source code is included in the package so users can easily look at the implementation.
- [Documentation](https://rob893.github.io/typescript-extended-linq/) is also auto-generated on every release so they will always be up to date as well.

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

Each function also can be used directly by passing in the source iterable as the first argument:

```typescript
import { join } from 'typescript-extended-linq';

type Person = { name: string };
type Pet = { name: string; owner: Person };

const magnus: Person = { name: 'Magnus' };
const terry: Person = { name: 'Terry' };
const adam: Person = { name: 'Adam' };
const john: Person = { name: 'John' };

const barley: Pet = { name: 'Barley', owner: terry };
const boots: Pet = { name: 'Boots', owner: terry };
const whiskers: Pet = { name: 'Whiskers', owner: adam };
const daisy: Pet = { name: 'Daisy', owner: magnus };
const scratchy: Pet = { name: 'Scratchy', owner: { name: 'Bob' } };

const people = from([magnus, terry, adam, john]);
const pets = from([barley, boots, whiskers, daisy, scratchy]);

const result = join(
  people,
  pets,
  person => person,
  pet => pet.owner,
  (person, pet) => ({ ownerName: person.name, pet: pet.name })
).toArray();

/**
 * Will log:
 * [
 *   { ownerName: 'Magnus', pet: 'Daisy' },
 *   { ownerName: 'Terry', pet: 'Barley' },
 *   { ownerName: 'Terry', pet: 'Boots' },
 *   { ownerName: 'Adam', pet: 'Whiskers' }
 * ]
 */
console.log(result);
```

## Documentation

Please see full documentation [here](https://rob893.github.io/typescript-extended-linq/).

### [aggregate](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#aggregate)

Applies an accumulator function over a sequence.

### [all](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#all)

Determines whether all elements of a sequence satisfy a condition.

### [any](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#any)

Determines whether any element of a sequence exists or satisfies a condition.

### [append](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#append)

Appends a value to the end of the sequence.

### [asEnumerable](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#asEnumerable)

Returns the input as an IEnumerable.

### [atLeast](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#atLeast)

Determines whether or not the number of elements in the sequence is greater than or equal to the given integer.

### [atMost](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#atMost)

### [average](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#average)

Computes the average of a sequence of numeric values.

### [chunk](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#chunk)

Split the elements of a sequence into chunks of size at most chunkSize.

### [concat](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#concat)

Concatenates two sequences.

### [contains](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#contains)

Determines whether a sequence contains a specified element.

### [count](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#count)

Returns the number of elements in a sequence.

### [defaultIfEmpty](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#defaultIfEmpty)

Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.

### [distinct](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#distinct)

Returns distinct elements from a sequence.

### [distinctBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#distinctBy)

Returns distinct elements from a sequence according to a specified key selector function.

### [elementAt](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#elementAt)

Returns the element at a specified index in a sequence.

### [elementAtOrDefault](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#elementAtOrDefault)

Returns the element at a specified index in a sequence or null if the index is out of range.

### [endsWith](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#endsWith)

### [except](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#except)

### [exceptBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#exceptBy)

### [first](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#first)

### [firstOrDefault](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#firstOrDefault)

### [forEach](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#forEach)

### [fullJoinHeterogeneous](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#fullJoinHeterogeneous)

Performs a full outer join on two heterogeneous sequences.

### [fullJoinHomogeneous](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#fullJoinHomogeneous)

Performs a full outer join on two homogeneous sequences.

### [groupBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#groupBy)

### [groupJoin](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#groupJoin)

Correlates the elements of two sequences based on key equality, and groups the results.

### [intersect](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#intersect)

### [intersectBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#intersectBy)

### [join](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#join)

Performs an inner join by correlating the elements of two sequences based on matching keys.

### [last](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#last)

### [lastOrDefault](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#lastOrDefault)

### [leftJoinHeterogeneous](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#leftJoinHeterogeneous)

Performs a left outer join on two heterogeneous sequences. Additional arguments specify key selection functions and result projection functions.

### [leftJoinHomogeneous](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#leftJoinHomogeneous)

Performs a left outer join on two homogeneous sequences. Additional arguments specify key selection functions and result projection functions.

### [max](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#max)

### [maxBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#maxBy)

### [min](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#min)

### [minBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#minBy)

### [ofType](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#ofType)

### [orderBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#orderBy)

### [orderByDescending](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#orderByDescending)

### [pipe](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#pipe)

### [prepend](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#prepend)

### [quantile](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#quantile)

### [reverse](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#reverse)

### [rightJoinHeterogeneous](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#rightJoinHeterogeneous)

Performs a right outer join on two heterogeneous sequences.

### [rightJoinHomogeneous](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#rightJoinHomogeneous)

Performs a right outer join on two homogeneous sequences.

### [select](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#select)

### [selectMany](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#selectMany)

### [sequenceEqual](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#sequenceEqual)

### [shuffle](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#shuffle)

### [single](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#single)

Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.

### [singleOrDefault](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#singleOrDefault)

### [skip](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#skip)

### [skipLast](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#skipLast)

### [skipWhile](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#skipWhile)

### [startsWith](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#startsWith)

### [sum](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#sum)

### [take](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#take)

### [takeEvery](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#takeEvery)

### [takeLast](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#takeLast)

### [takeWhile](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#takeWhile)

### [thenBy](https://rob893.github.io/typescript-extended-linq/interfaces/IOrderedEnumerable.html#thenBy)

### [thenByDescending](https://rob893.github.io/typescript-extended-linq/interfaces/IOrderedEnumerable.html#thenByDescending)

### [to](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#to)

Creates a new instance of the passed in ctor with the Iterable as input.

### [toArray](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#toArray)

### [toMap](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#toMap)

### [toObject](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#toObject)

### [toSet](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#toSet)

### [union](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#union)

### [unionBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#unionBy)

### [where](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#where)

### [zip](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#zip)
