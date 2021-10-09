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

### Additional Collections

- This library comes with [List](https://rob893.github.io/typescript-extended-linq/classes/List.html), [LinkedList](https://rob893.github.io/typescript-extended-linq/classes/LinkedList.html), [Stack](https://rob893.github.io/typescript-extended-linq/classes/Stack.html), [Queue](https://rob893.github.io/typescript-extended-linq/classes/Queue.html), and [PriorityQueue](https://rob893.github.io/typescript-extended-linq/classes/PriorityQueue.html) collections all which have all the linq functions.

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

Determines whether or not the number of elements in the sequence is lesser than or equal to the given integer.

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

Returns the element at a specified index in a sequence. A negative index can be used to get element starting from the end.

### [elementAtOrDefault](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#elementAtOrDefault)

Returns the element at a specified index in a sequence or null if the index is out of range. A negative index can be used to get element starting from the end.

### [endsWith](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#endsWith)

Determines whether the end of the first sequence is equivalent to the second sequence.

### [except](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#except)

Produces the set difference of two sequences.

### [exceptBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#exceptBy)

Produces the set difference of two sequences according to a specified key selector function.

### [first](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#first)

Returns the first element in a sequence. Throws if sequence contains no elements.

### [firstOrDefault](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#firstOrDefault)

Returns the first element in a sequence. Returns null if sequence contains no elements

### [flatten](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#flatten)

Returns a new IEnumerable with all sub-iterable elements concatenated into it recursively up to the specified depth.

### [forEach](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#forEach)

Iterates the sequence and calls an action on each element.

### [fullJoinHeterogeneous](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#fullJoinHeterogeneous)

Performs a full outer join on two heterogeneous sequences.

### [fullJoinHomogeneous](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#fullJoinHomogeneous)

Performs a full outer join on two homogeneous sequences.

### [groupBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#groupBy)

Groups the elements of a sequence according to a specified key selector function.

### [groupJoin](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#groupJoin)

Correlates the elements of two sequences based on key equality, and groups the results.

### [intersect](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#intersect)

Produces the set intersection of two sequences.

### [intersectBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#intersectBy)

Produces the set intersection of two sequences according to a specified key selector function.

### [join](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#join)

Performs an inner join by correlating the elements of two sequences based on matching keys.

### [last](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#last)

Returns the last element of a sequence.

### [lastOrDefault](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#lastOrDefault)

Returns the last element of a sequence, or null if the sequence contains no elements.

### [leftJoinHeterogeneous](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#leftJoinHeterogeneous)

Performs a left outer join on two heterogeneous sequences. Additional arguments specify key selection functions and result projection functions.

### [leftJoinHomogeneous](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#leftJoinHomogeneous)

Performs a left outer join on two homogeneous sequences. Additional arguments specify key selection functions and result projection functions.

### [max](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#max)

Returns the maximum value in a sequence of values.

### [maxBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#maxBy)

Returns the maximum value in a generic sequence according to a specified key selector function.

### [min](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#min)

Returns the min value in a sequence of values.

### [minBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#minBy)

Returns the min value in a generic sequence according to a specified key selector function.

### [ofType](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#ofType)

Filters the elements of an IEnumerable based on a specified type.

### [orderBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#orderBy)

Sorts the elements of a sequence in ascending order.

### [orderByDescending](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#orderByDescending)

Sorts the elements of a sequence in descending order.

### [pipe](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#pipe)

Executes the given action on each element in the source sequence and yields it.

### [prepend](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#prepend)

Adds a value to the beginning of the sequence.

### [quantile](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#quantile)

Computes the quantile of a sequence.

### [reverse](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#reverse)

Inverts the order of the elements in a sequence.

### [rightJoinHeterogeneous](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#rightJoinHeterogeneous)

Performs a right outer join on two heterogeneous sequences.

### [rightJoinHomogeneous](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#rightJoinHomogeneous)

Performs a right outer join on two homogeneous sequences.

### [select](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#select)

Projects each element of a sequence into a new form.

### [selectMany](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#selectMany)

Projects each element of a sequence to an IEnumerable<T> and flattens the resulting sequences into one sequence.

### [sequenceEqual](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#sequenceEqual)

Determines whether two sequences are equal by comparing the elements.

### [shuffle](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#shuffle)

Returns a new IEnumerable<TSource> of the input sequence in random order.

### [single](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#single)

Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.

### [singleOrDefault](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#singleOrDefault)

Returns a single, specific element of a sequence, or null if that element is not found.

### [skip](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#skip)

Bypasses a specified number of elements in a sequence and then returns the remaining elements.

### [skipLast](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#skipLast)

Returns a new enumerable collection that contains the elements from source with the last count elements of the source collection omitted.

### [skipWhile](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#skipWhile)

Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.

### [split](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#split)

Splits the source sequence by a separator.

### [startsWith](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#startsWith)

Determines whether the beginning of the first sequence is equivalent to the second sequence.

### [sum](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#sum)

Computes the sum of a sequence of numeric values.

### [take](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#take)

Returns a specified number of contiguous elements from the start of a sequence.

### [takeEvery](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#takeEvery)

Returns every N-th element of a sequence.

### [takeLast](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#takeLast)

Returns a new enumerable collection that contains the last count elements from source.

### [takeWhile](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#takeWhile)

Returns elements from a sequence as long as a specified condition is true, and then skips the remaining elements.

### [thenBy](https://rob893.github.io/typescript-extended-linq/interfaces/IOrderedEnumerable.html#thenBy)

Performs a subsequent ordering of the elements in a sequence in ascending order.

### [thenByDescending](https://rob893.github.io/typescript-extended-linq/interfaces/IOrderedEnumerable.html#thenByDescending)

Performs a subsequent ordering of the elements in a sequence in descending order.

### [to](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#to)

Creates a new instance of the passed in ctor with the Iterable as input.

### [toArray](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#toArray)

Converts the source sequence into an array.

### [toMap](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#toMap)

Creates a Map<TKey, TValue> from an IEnumerable<T> according to specified key selector.

### [toObject](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#toObject)

Returns an object with keys selected by keySelector and values of TSource.

### [toSet](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#toSet)

Creates a Set<T> from an IEnumerable<T>.

### [union](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#union)

Produces the set union of two sequences.

### [unionBy](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#unionBy)

Produces the set union of two sequences according to a specified key selector function.

### [where](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#where)

Filters a sequence of values based on a predicate.

### [zip](https://rob893.github.io/typescript-extended-linq/interfaces/IEnumerable.html#zip)

Produces a sequence of tuples with elements from the two specified sequences.
