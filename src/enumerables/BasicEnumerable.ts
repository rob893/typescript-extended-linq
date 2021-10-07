import { aggregate } from '../functions/aggregate';
import { all } from '../functions/all';
import { any } from '../functions/any';
import { applyAppend } from '../functions/applicators/applyAppend';
import { applyAsEnumerable } from '../functions/applicators/applyAsEnumerable';
import { applyChunk } from '../functions/applicators/applyChunk';
import { applyConcat } from '../functions/applicators/applyConcat';
import { applyDefaultIfEmpty } from '../functions/applicators/applyDefaultIfEmpty';
import { applyDistinct } from '../functions/applicators/applyDistinct';
import { applyExcept } from '../functions/applicators/applyExcept';
import { applyFullJoinHeterogeneous, applyFullJoinHomogeneous } from '../functions/applicators/applyFullJoin';
import { applyGroupBy } from '../functions/applicators/applyGroupBy';
import { applyGroupJoin } from '../functions/applicators/applyGroupJoin';
import { applyIntersect } from '../functions/applicators/applyIntersect';
import { applyJoin } from '../functions/applicators/applyJoin';
import { applyLeftJoinHeterogeneous, applyLeftJoinHomogeneous } from '../functions/applicators/applyLeftJoin';
import { applyMax } from '../functions/applicators/applyMax';
import { applyMin } from '../functions/applicators/applyMin';
import { applyOfType } from '../functions/applicators/applyOfType';
import { applyOrderBy } from '../functions/applicators/applyOrderBy';
import { applyPipe } from '../functions/applicators/applyPipe';
import { applyPrepend } from '../functions/applicators/applyPrepend';
import { applyQuantile } from '../functions/applicators/applyQuantile';
import { applyReverse } from '../functions/applicators/applyReverse';
import { applyRightJoinHeterogeneous, applyRightJoinHomogeneous } from '../functions/applicators/applyRightJoin';
import { applySelect, applySelectMany } from '../functions/applicators/applySelect';
import { applyShuffle } from '../functions/applicators/applyShuffle';
import { applySkip, applySkipLast, applySkipWhile } from '../functions/applicators/applySkip';
import { applySplit } from '../functions/applicators/applySplit';
import { applyTake, applyTakeEvery, applyTakeLast, applyTakeWhile } from '../functions/applicators/applyTake';
import { applyUnion } from '../functions/applicators/applyUnion';
import { applyWhere } from '../functions/applicators/applyWhere';
import { applyWindow } from '../functions/applicators/applyWindow';
import { applyZip } from '../functions/applicators/applyZip';
import { atLeast } from '../functions/atLeast';
import { atMost } from '../functions/atMost';
import { average } from '../functions/average';
import { contains } from '../functions/contains';
import { count } from '../functions/count';
import { elementAt, elementAtOrDefault } from '../functions/elementAt';
import { endsWith } from '../functions/endsWith';
import { first, firstOrDefault } from '../functions/first';
import { forEach } from '../functions/forEach';
import { last, lastOrDefault } from '../functions/last';
import { sequenceEqual } from '../functions/sequenceEqual';
import { single, singleOrDefault } from '../functions/single';
import { startsWith } from '../functions/startsWith';
import { sum } from '../functions/sum';
import { to } from '../functions/to';
import { toArray } from '../functions/toArray';
import { toMap } from '../functions/toMap';
import { toObject } from '../functions/toObject';
import { toSet } from '../functions/toSet';
import {
  Comparer,
  EqualityComparer,
  IEnumerable,
  IGrouping,
  IOrderedEnumerable,
  IEnumerableFactory,
  IList
} from '../types';

/**
 * Class that exposes an iterator, which supports a simple iteration and various methods.
 * @typeparam TSource The type of elements in the Enumerable.
 */
export class BasicEnumerable<TSource> implements IEnumerable<TSource> {
  protected readonly factory: IEnumerableFactory;

  protected readonly srcGenerator: () => Generator<TSource>;

  public constructor(factory: IEnumerableFactory, srcGenerator: () => Generator<TSource>) {
    this.factory = factory;
    this.srcGenerator = srcGenerator;
  }

  /**
   * Exposes an iterator that can be used for iteration.
   * @example
   * ```typescript
   * const numbers = from([1, 2, 3]);
   * for (const number of numbers) {
   *   // Iteration is allowed because of the iterator.
   * }
   * ```
   * @returns The iterator for the IEnumerable.
   */
  public [Symbol.iterator](): Generator<TSource> {
    return this.srcGenerator();
  }

  /**
   * Applies an accumulator function over a sequence.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const sum = from(items)
   *   .aggregate((prev, curr) => prev + curr); // sum will be 6
   * ```
   * @param aggregator An accumulator function to be invoked on each element.
   * @returns The final accumulator value.
   */
  public aggregate(aggregator: (prev: TSource, curr: TSource, index: number) => TSource): TSource;

  /**
   * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const sum = from(items)
   *   .aggregate(10, (prev, curr) => prev + curr); // sum will be 16
   * ```
   * @typeparam TAccumulate The type of the accumulator value.
   * @param seed The initial accumulator value.
   * @param aggregator An accumulator function to be invoked on each element.
   * @returns The final accumulator value.
   */
  public aggregate<TAccumulate>(
    seed: TAccumulate,
    aggregator: (prev: TAccumulate, curr: TSource, index: number) => TAccumulate
  ): TAccumulate;

  /**
   * Applies an accumulator function over a sequence.
   * The specified seed value is used as the initial accumulator value, and the specified function is used to select the result value.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const sum = from(items)
   *   .aggregate(10, (prev, curr) => prev + curr, result => ({ result })); // sum will be { result: 16 }
   * ```
   * @typeparam TAccumulate The type of the accumulator value.
   * @typeparam TResult The type of the resulting value.
   * @param seed The initial accumulator value.
   * @param aggregator An accumulator function to be invoked on each element.
   * @param resultSelector An accumulator function to be invoked on each element.
   * @returns The final accumulator value.
   */
  public aggregate<TAccumulate, TResult>(
    seed: TAccumulate,
    aggregator: (prev: TAccumulate, curr: TSource, index: number) => TAccumulate,
    resultSelector: (accumulated: TAccumulate) => TResult
  ): TResult;

  public aggregate<TAccumulate, TResult>(
    seedOrAggregator:
      | (TAccumulate | TSource)
      | ((prev: TAccumulate | TSource, curr: TSource, index: number) => TAccumulate | TSource),
    aggregator?: (prev: TAccumulate | TSource, curr: TSource, index: number) => TAccumulate | TSource,
    resultSelector?: (accumulated: TAccumulate) => TResult
  ): TAccumulate | TSource | TResult {
    return aggregate(this, seedOrAggregator, aggregator, resultSelector);
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const areAllNumbersEven = from(numbers).all(x => x % 2 === 0); // false
   * ```
   * @param predicate A function to test each element for a condition.
   * @returns true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
   */
  public all(predicate: (item: TSource, index: number) => boolean): boolean {
    return all(this, predicate);
  }

  /**
   * Determines whether any element of a sequence exists or satisfies a condition.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const areAnyNumbersEven = from(numbers).any(); // true
   * ```
   * @returns true if the source sequence contains any elements (or if at least one matches condition if condition is passed); otherwise, false.
   */
  public any(): boolean;

  /**
   * Determines whether any element of a sequence exists or satisfies a condition.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const areAnyNumbersEven = from(numbers).any(x => x % 2 === 0); // true
   * ```
   * @param predicate A function to test each element for a condition.
   * @returns true if the source sequence contains any elements (or if at least one matches condition if condition is passed); otherwise, false.
   */
  public any(predicate: (item: TSource, index: number) => boolean): boolean;

  public any(predicate?: (item: TSource, index: number) => boolean): boolean {
    return any(this, predicate);
  }

  /**
   * Appends a value to the end of the sequence.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const withFive = from(numbers).append(5); // [1, 2, 3, 4, 5]
   * ```
   * @param item The value to append.
   * @returns A new sequence that ends with element.
   */
  public append(item: TSource): IEnumerable<TSource> {
    return applyAppend(this.factory, this, item);
  }

  /**
   * Returns the input as an IEnumerable.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const asEnumerable = from(items).asEnumerable();
   * ```
   * @returns The input sequence as IEnumerable.
   */
  public asEnumerable(): IEnumerable<TSource> {
    return applyAsEnumerable(this.factory, this);
  }

  /**
   * Determines whether or not the number of elements in the sequence is greater than or equal to the given integer.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const atLeastThree = from(items).atLeast(3); // true
   * const atLeastFour = from(items).atLeast(4); // false
   * ```
   * @param count The minimum number of items a sequence must have for this function to return true
   * @returns true if the number of elements in the sequence is greater than or equal to the given integer or false otherwise.
   */
  public atLeast(count: number): boolean;

  /**
   * Determines whether or not the number of elements in the sequence is greater than or equal to the given integer.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const atLeastOneEven = from(items).atLeast(1, x => x % 2 === 0); // true
   * const atLeastTwoEven = from(items).atLeast(2, x => x % 2 === 0); // false
   * ```
   * @param count The minimum number of items a sequence must have for this function to return true
   * @param predicate A function to test each element for a condition.
   * @returns true if the number of elements in the sequence is greater than or equal to the given integer or false otherwise.
   */
  public atLeast(count: number, predicate: (item: TSource, index: number) => boolean): boolean;

  public atLeast(count: number, predicate?: (item: TSource, index: number) => boolean): boolean {
    return atLeast(this, count, predicate);
  }

  /**
   * Determines whether or not the number of elements in the sequence is lesser than or equal to the given integer.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const atMostTwo = from(items).atMost(2); // false
   * const atMostFour = from(items).atMost(4); // true
   * ```
   * @param count The maximun number of items a sequence must have for this function to return true.
   * @returns true if the number of elements in the sequence is lesser than or equal to the given integer or false otherwise.
   */
  public atMost(count: number): boolean;

  /**
   * Determines whether or not the number of elements that match the predicate in the sequence is lesser than or equal to the given integer.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const atMostTwo = from(items).atMost(2, x => x > 0); // false
   * const atMostFour = from(items).atMost(4, x => x > 2); // true
   * ```
   * @param count The maximun number of items a sequence must have for this function to return true.
   * @param predicate The condition to match the elements by.
   * @returns true if the number of elements that match the predicate in the sequence is lesser than or equal to the given integer or false otherwise.
   */
  public atMost(count: number, predicate: (item: TSource, index: number) => boolean): boolean;

  public atMost(count: number, predicate?: (item: TSource, index: number) => boolean): boolean {
    return atMost(this, count, predicate);
  }

  /**
   * Computes the average of a sequence of numeric values.
   * @example
   * ```typescript
   * const numbers = [2, 2, 1, 3];
   * const average = from(numbers).average(); // 2
   * ```
   * @returns The average of the sequence of values.
   */
  public average(): number;

  /**
   * Computes the average of a sequence of numeric values.
   * @example
   * ```typescript
   * const numbers = [{ age: 20 }, { age: 10 }, { age: 30 }];
   * const average = from(numbers).average(x => x.age); // 20
   * ```
   * @param selector A transform function to apply to each element.
   * @returns The average of the sequence of values.
   */
  public average(selector: (item: TSource) => number): number;

  public average(selector?: (item: TSource) => number): number {
    return average(this, selector);
  }

  /**
   * Split the elements of a sequence into chunks of size at most chunkSize.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4, 5];
   * const chunks = from(numbers).chunk(2); // [[1, 2], [3, 4], [5]]
   * ```
   * @param chunkSize The maximum size of each chunk.
   * @returns An IEnumerable<TSource> that contains the elements the input sequence split into chunks of size chunkSize.
   */
  public chunk(chunkSize: number): IEnumerable<IEnumerable<TSource>> {
    return applyChunk(this.factory, this, chunkSize);
  }

  /**
   * Concatenates two sequences.
   * @example
   * ```typescript
   * const numbers = [1, 2];
   * const moreNumbers = from(numbers).concat([3, 4, 5]); // [1, 2, 3, 4, 5]
   * const evenMoreNumbers = from(numbers).concat([3, 4], [5, 6]); // [1, 2, 3, 4, 5, 6]
   * ```
   * @param collections The sequences to concatenate to the first sequence.
   * @returns An IEnumerable<TSource> that contains the concatenated elements of the two input sequences.
   */
  public concat(...collections: Iterable<TSource>[]): IEnumerable<TSource> {
    return applyConcat(this.factory, this, collections);
  }

  /**
   * Determines whether a sequence contains a specified element.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3];
   * const hasThree = from(numbers).contains(3); // true
   * ```
   * @param value The value to locate in the sequence.
   * @returns true if the source sequence contains an element that has the specified value; otherwise, false.
   */
  public contains(value: TSource): boolean;

  /**
   * Determines whether a sequence contains a specified element.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3];
   * const hasThree = from(numbers).contains(3, (a, b) => a === b); // true
   * ```
   * @param value The value to locate in the sequence.
   * @param equalityComparer An equality comparer to compare values.
   * @returns true if the source sequence contains an element that has the specified value; otherwise, false.
   */
  public contains(value: TSource, equalityComparer: EqualityComparer<TSource>): boolean;

  public contains(value: TSource, equalityComparer?: EqualityComparer<TSource>): boolean {
    return contains(this, value, equalityComparer);
  }

  /**
   * Returns the number of elements in a sequence.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3];
   * const numCount = from(numbers).count(); // 3
   * ```
   * @returns The number of elements in the input sequence.
   */
  public count(): number;

  /**
   * Returns the number of elements in a sequence.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3];
   * const evenNumCount = from(numbers).count(x => x % 2 === 0); // 1
   * ```
   * @param predicate A function to test each element for a condition.
   * @returns The number of elements in the input sequence.
   */
  public count(predicate: (item: TSource, index: number) => boolean): number;

  public count(predicate?: (item: TSource, index: number) => boolean): number {
    return count(this, predicate);
  }

  /**
   * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
   * @example
   * ```typescript
   * const defaultNum = 0;
   * const items = [];
   * const itemsWithDefault = from(items).defaultIfEmpty(defaultNum); // [0];
   * ```
   * @param defaultItem The value to return if the sequence is empty.
   * @returns An IEnumerable<TSource> that contains defaultValue if source is empty; otherwise, source.
   */
  public defaultIfEmpty(defaultItem: TSource): IEnumerable<TSource> {
    return applyDefaultIfEmpty(this.factory, this, defaultItem);
  }

  /**
   * Returns distinct elements from a sequence.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 1, 2];
   * const distinct = from(items).distinct(); // Will be [1, 2, 3]
   * ```
   * @returns An IEnumerable<TSource> that contains distinct elements from the source sequence.
   */
  public distinct(): IEnumerable<TSource>;

  /**
   * Returns distinct elements from a sequence.
   * @example
   * ```typescript
   * const items = [{ name: 'bob' }, { name: 'Joe' }, { name: 'Bob' }];
   * const distinct = from(items).distinct((a, b) => a.name.toUpperCase() === b.name.toUpperCase()); // Will be [{ name: 'bob' }, { name: 'Joe' }]
   * ```
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns An IEnumerable<TSource> that contains distinct elements from the source sequence.
   */
  public distinct(equalityComparer: EqualityComparer<TSource>): IEnumerable<TSource>;

  public distinct(equalityComparer?: EqualityComparer<TSource>): IEnumerable<TSource> {
    return applyDistinct(this.factory, this, x => x, equalityComparer);
  }

  /**
   * Returns distinct elements from a sequence according to a specified key selector function.
   * @example
   * ```typescript
   * const items = [{ name: 'bob', id: 1 }, { name: 'Joe', id: 2 }, { name: 'Bob', id: 3 }, { name: 'John', id: 2 }];
   * const distinct = from(items).distinctBy(x => x.id); // Will be [{ name: 'bob', id: 1 }, { name: 'Joe', id: 2 }, { name: 'Bob', id: 3 }]
   * ```
   * @typeparam TKey The type of key to distinguish elements by.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<TSource> that contains distinct elements from the source sequence.
   */
  public distinctBy<TKey>(keySelector: (item: TSource) => TKey): IEnumerable<TSource>;

  /**
   * Returns distinct elements from a sequence according to a specified key selector function.
   * @example
   * ```typescript
   * const items = [{ name: 'bob', id: 1 }, { name: 'Joe', id: 2 }, { name: 'Bob', id: 3 }, { name: 'John', id: 2 }];
   * const distinct = from(items).distinctBy(x => x.id, (a, b) => a === b); // Will be [{ name: 'bob', id: 1 }, { name: 'Joe', id: 2 }, { name: 'Bob', id: 3 }]
   * ```
   * @typeparam TKey The type of key to distinguish elements by.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns An IEnumerable<TSource> that contains distinct elements from the source sequence.
   */
  public distinctBy<TKey>(
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  public distinctBy<TKey>(
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TSource> {
    return applyDistinct(this.factory, this, keySelector, equalityComparer);
  }

  /**
   * Returns the element at a specified index in a sequence.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const indexZero = from(items).elementAt(0); // Will be 1
   * const willThrow = from(items).elementAt(10); // This will throw.
   * ```
   * @param index The zero-based index of the element to retrieve.
   * @returns The element at the specified position in the source sequence.
   */
  public elementAt(index: number): TSource {
    return elementAt(this, index);
  }

  /**
   * Returns the element at a specified index in a sequence or null if the index is out of range.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const indexZero = from(items).elementAt(0); // Will be 1
   * const willBeNull = from(items).elementAt(10); // Will be null.
   * ```
   * @param index The zero-based index of the element to retrieve.
   * @returns The element at the specified position in the source sequence.
   */
  public elementAtOrDefault(index: number): TSource | null {
    return elementAtOrDefault(this, index);
  }

  /**
   * Determines whether the end of the first sequence is equivalent to the second sequence.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const endsWith = from(items).endsWith([2, 3]); // true
   * const doesNotEndWith = from(items).endsWith([3, 2]); // false
   * ```
   * @param second The sequence to compare to.
   * @returns true if first ends with elements equivalent to second.
   */
  public endsWith(second: Iterable<TSource>): boolean;

  /**
   * Determines whether the end of the first sequence is equivalent to the second sequence, using the specified element equality comparer.
   * @example
   * ```typescript
   * const items = [1, 2, 3];
   * const endsWith = from(items).endsWith([2, 3], (a, b) => a === b); // true
   * const doesNotEndWith = from(items).endsWith([3, 2], (a, b) => a === b); // false
   * ```
   * @param second The sequence to compare to.
   * @param equalityComparer Equality comparer to use.
   * @returns true if first ends with elements equivalent to second.
   */
  public endsWith(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): boolean;

  public endsWith(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): boolean {
    return endsWith(this, second, equalityComparer);
  }

  /**
   * Produces the set difference of two sequences.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4];
   * const exceptItems = from(items).except([2, 4]); // [1, 3]
   * ```
   * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  public except(...second: Iterable<TSource>[]): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4];
   * const exceptItems = from(items).except([2, 4], (a, b) => a === b); // [1, 3]
   * ```
   * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  public except(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4];
   * const exceptItems = from(items).except([2, 4], [3], (a, b) => a === b); // [1]
   * ```
   * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param third An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  public except(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4, 5, 6, 7];
   * const exceptItems = from(items).except([2, 4], [3, 5], [7], (a, b) => a === b); // [1, 6]
   * ```
   * @param second An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param third An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param fourth An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  public except(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;

  public except(...second: (Iterable<TSource> | EqualityComparer<TSource>)[]): IEnumerable<TSource> {
    return applyExcept(this.factory, x => x, this, ...second);
  }

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param keySelector A function to extract the key for each element.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  public exceptBy<TKey>(second: Iterable<TKey>, keySelector: (item: TSource) => TKey): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param third An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param keySelector A function to extract the key for each element.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  public exceptBy<TKey>(
    second: Iterable<TKey>,
    third: Iterable<TKey>,
    keySelector: (item: TSource) => TKey
  ): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param third An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param fourth An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param keySelector A function to extract the key for each element.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  public exceptBy<TKey>(
    second: Iterable<TKey>,
    third: Iterable<TKey>,
    fourth: Iterable<TKey>,
    keySelector: (item: TSource) => TKey
  ): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  public exceptBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param third An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  public exceptBy<TKey>(
    second: Iterable<TKey>,
    thrid: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces the set difference of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param third An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param fourth An Iterable<T> whose keys that also occur in the first sequence will cause those elements to be removed from the returned sequence.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer An EqualityComparer<T> to compare values.
   * @returns A sequence that contains the set difference of the elements of two sequences.
   */
  public exceptBy<TKey>(
    second: Iterable<TKey>,
    thrid: Iterable<TKey>,
    fourth: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  public exceptBy<TKey>(
    ...second: (Iterable<TKey> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
  ): IEnumerable<TSource> {
    return applyExcept(this.factory, null, this, ...second);
  }

  /**
   * Returns the first element in a sequence. Throws if sequence contains no elements.
   * @returns The first element in the sequence.
   */
  public first(): TSource;

  /**
   * Returns the first element in a sequence that satisfies a specified condition. Throws if sequence contains no elements that matches condition.
   * @param predicate A function to test each element for a condition.
   * @returns The first element in the sequence that passes the test in the specified predicate function.
   */
  public first(predicate: (item: TSource, index: number) => boolean): TSource;

  public first(condition?: (item: TSource, index: number) => boolean): TSource {
    return first(this, condition);
  }

  /**
   * Returns the first element in a sequence. Returns null if sequence contains no elements.
   * @returns The first element in the sequence or null.
   */
  public firstOrDefault(): TSource | null;

  /**
   * Returns the first element in a sequence that satisfies a specified condition. Returns null if sequence contains no elements that matches condition.
   * @param predicate A function to test each element for a condition.
   * @returns The first element in the sequence that passes the test in the specified predicate function or null.
   */
  public firstOrDefault(predicate: (item: TSource, index: number) => boolean): TSource | null;

  public firstOrDefault(condition?: (item: TSource, index: number) => boolean): TSource | null {
    return firstOrDefault(this, condition);
  }

  /**
   * Iterates the sequence and calls an action on each element.
   * @param action The action to perform on each item in the sequence.
   */
  public forEach(callback: (item: TSource, index: number) => void): void {
    forEach(this, callback);
  }

  /**
   * Performs a full outer join on two heterogeneous sequences.
   * Additional arguments specify key selection functions, result projection functions and a key comparer.
   * @typeparam TSecond The type of elements in the second sequence.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param firstKeySelector Function that projects the key given an element from first.
   * @param secondKeySelector Function that projects the key given an element from second.
   * @param firstSelector: Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  public fullJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult
  ): IEnumerable<TResult>;

  /**
   * Performs a full outer join on two heterogeneous sequences.
   * Additional arguments specify key selection functions, result projection functions and a key comparer.
   * @typeparam TSecond The type of elements in the second sequence.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param firstKeySelector Function that projects the key given an element from first.
   * @param secondKeySelector Function that projects the key given an element from second.
   * @param firstSelector: Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  public fullJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  public fullJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyFullJoinHeterogeneous(
      this.factory,
      this,
      second,
      firstKeySelector,
      secondKeySelector,
      firstSelector,
      secondSelector,
      bothSelector,
      equalityComparer
    );
  }

  /**
   * Performs a full outer join on two homogeneous sequences.
   * Additional arguments specify key selection functions and result projection functions.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param keySelector Function that projects the key given an element of one of the sequences to join.
   * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @returns A sequence containing results projected from a full outer join of the two input sequences.
   */
  public fullJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult
  ): IEnumerable<TResult>;

  /**
   * Performs a full outer join on two homogeneous sequences.
   * Additional arguments specify key selection functions and result projection functions.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param keySelector Function that projects the key given an element of one of the sequences to join.
   * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a full outer join of the two input sequences.
   */
  public fullJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  public fullJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyFullJoinHomogeneous(
      this.factory,
      this,
      second,
      keySelector,
      firstSelector,
      secondSelector,
      bothSelector,
      equalityComparer
    );
  }

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<IGrouping<TKey, TSource>> where each IGrouping<TKey, TSource> object contains a sequence of objects and a key.
   */
  public groupBy<TKey>(keySelector: (item: TSource) => TKey): IEnumerable<IGrouping<TKey, TSource>>;

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer A function to compare keys.
   * @returns An IEnumerable<IGrouping<TKey, TSource>> where each IGrouping<TKey, TSource> object contains a sequence of objects and a key.
   */
  public groupBy<TKey>(
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<IGrouping<TKey, TSource>>;

  public groupBy<TKey>(
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<IGrouping<TKey, TSource>> {
    return applyGroupBy(this.factory, this, keySelector, equalityComparer);
  }

  /**
   * Correlates the elements of two sequences based on key equality, and groups the results.
   * @example
   * ```typescript
   * const magnus = { name: 'Magnus' };
   * const terry = { name: 'Terry' };
   * const adam = { name: 'Adam' };
   * const john = { name: 'John' };
   *
   * const barley = { name: 'Barley', owner: terry };
   * const boots = { name: 'Boots', owner: terry };
   * const whiskers = { name: 'Whiskers', owner: adam };
   * const daisy = { name: 'Daisy', owner: magnus };
   * const scratchy = { name: 'Scratchy', owner: { name: 'Bob' } };
   *
   * const people = from([magnus, terry, adam, john]);
   * const pets = from([barley, boots, whiskers, daisy, scratchy]);
   *
   * const result = people
   *   .groupJoin(
   *     pets,
   *     person => person,
   *     pet => pet.owner,
   *     (person, petCollection) => ({ ownerName: person.name, pets: petCollection.select(p => p.name).toArray() })
   *   )
   *   .toArray();
   *
   * expect(result).toEqual([
   *   { ownerName: 'Magnus', pets: ['Daisy'] },
   *   { ownerName: 'Terry', pets: ['Barley', 'Boots'] },
   *   { ownerName: 'Adam', pets: ['Whiskers'] },
   *   { ownerName: 'John', pets: [] }
   * ]);
   * ```
   * @typeparam TInner The type of the elements of the second sequence.
   * @typeparam TKey The type of the keys returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param inner The sequence to join to the first sequence.
   * @param outerKeySelector A function to extract the join key from each element of the first sequence.
   * @param innerKeySelector A function to extract the join key from each element of the second sequence.
   * @param resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
   */
  public groupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: IEnumerable<TInner>) => TResult
  ): IEnumerable<TResult>;

  /**
   * Correlates the elements of two sequences based on key equality, and groups the results.
   * @example
   * ```typescript
   * const magnus = { name: 'Magnus' };
   * const terry = { name: 'Terry' };
   * const adam = { name: 'Adam' };
   * const john = { name: 'John' };
   *
   * const barley = { name: 'Barley', owner: terry };
   * const boots = { name: 'Boots', owner: terry };
   * const whiskers = { name: 'Whiskers', owner: adam };
   * const daisy = { name: 'Daisy', owner: magnus };
   * const scratchy = { name: 'Scratchy', owner: { name: 'Bob' } };
   *
   * const people = from([magnus, terry, adam, john]);
   * const pets = from([barley, boots, whiskers, daisy, scratchy]);
   *
   * const result = people
   *   .groupJoin(
   *     pets,
   *     person => person,
   *     pet => pet.owner,
   *     (person, petCollection) => ({ ownerName: person.name, pets: petCollection.select(p => p.name).toArray() }),
   *     (person, pet) => person.name === pet.owner.name
   *   )
   *   .toArray();
   *
   * expect(result).toEqual([
   *   { ownerName: 'Magnus', pets: ['Daisy'] },
   *   { ownerName: 'Terry', pets: ['Barley', 'Boots'] },
   *   { ownerName: 'Adam', pets: ['Whiskers'] },
   *   { ownerName: 'John', pets: [] }
   * ]);
   * ```
   * @typeparam TInner The type of the elements of the second sequence.
   * @typeparam TKey The type of the keys returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param inner The sequence to join to the first sequence.
   * @param outerKeySelector A function to extract the join key from each element of the first sequence.
   * @param innerKeySelector A function to extract the join key from each element of the second sequence.
   * @param resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
   * @param equalityComparer An IEnumerable<TResult> that contains elements of type TResult that are obtained by performing a grouped join on two sequences.
   */
  public groupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: IEnumerable<TInner>) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  public groupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: IEnumerable<TInner>) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyGroupJoin(
      this.factory,
      this,
      inner,
      outerKeySelector,
      innerKeySelector,
      resultSelector,
      equalityComparer
    );
  }

  /**
   * Produces the set intersection of two sequences.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  public intersect(second: Iterable<TSource>): IEnumerable<TSource>;

  /**
   * Produces the set intersection of two sequences.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  public intersect(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): IEnumerable<TSource>;

  public intersect(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): IEnumerable<TSource> {
    return applyIntersect(this.factory, this, second, x => x, equalityComparer);
  }

  /**
   * Produces the set intersection of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param keySelector A function to extract the key for each element.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  public intersectBy<TKey>(second: Iterable<TKey>, keySelector: (item: TSource) => TKey): IEnumerable<TSource>;

  /**
   * Produces the set intersection of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements that also appear in the first sequence will be returned.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence that contains the elements that form the set intersection of two sequences.
   */
  public intersectBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  public intersectBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TSource> {
    return applyIntersect(this.factory, this, second, keySelector, equalityComparer);
  }

  /**
   * Performs an inner join by correlating the elements of two sequences based on matching keys.
   * @example
   * ```typescript
   * const magnus = { name: 'Magnus' };
   * const terry = { name: 'Terry' };
   * const adam = { name: 'Adam' };
   * const john = { name: 'John' };
   *
   * const barley = { name: 'Barley', owner: terry };
   * const boots = { name: 'Boots', owner: terry };
   * const whiskers = { name: 'Whiskers', owner: adam };
   * const daisy = { name: 'Daisy', owner: magnus };
   * const scratchy = { name: 'Scratchy', owner: { name: 'Bob' } };
   *
   * const people = from([magnus, terry, adam, john]);
   * const pets = from([barley, boots, whiskers, daisy, scratchy]);
   *
   * const result = people.join(
   *     pets,
   *     person => person,
   *     pet => pet.owner,
   *     (person, pet) => ({ ownerName: person.name, pet: pet.name })
   *   )
   *   .toArray();
   *
   * expect(result).toEqual([
   *   { ownerName: 'Magnus', pet: 'Daisy' },
   *   { ownerName: 'Terry', pet: 'Barley' },
   *   { ownerName: 'Terry', pet: 'Boots' },
   *   { ownerName: 'Adam', pet: 'Whiskers' }
   * ]);
   * ```
   * @typeparam TInner The type of the elements of the second sequence.
   * @typeparam TKey The type of the keys returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param inner The second sequence to join to the first.
   * @param outerKeySelector A function to extract the join key from each element of the first sequence.
   * @param innerKeySelector A function to extract the join key from each element of the second sequence.
   * @param resultSelector A function to create a result element from two matching elements.
   * @returns An IEnumerable<TResult> that has elements of type TResult that are obtained by performing an inner join on two sequences.
   */
  public join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: TInner) => TResult
  ): IEnumerable<TResult>;

  /**
   * Performs an inner join by correlating the elements of two sequences based on matching keys.
   * @example
   * ```typescript
   * const magnus = { name: 'Magnus' };
   * const terry = { name: 'Terry' };
   * const adam = { name: 'Adam' };
   * const john = { name: 'John' };
   *
   * const barley = { name: 'Barley', owner: terry };
   * const boots = { name: 'Boots', owner: terry };
   * const whiskers = { name: 'Whiskers', owner: adam };
   * const daisy = { name: 'Daisy', owner: magnus };
   * const scratchy = { name: 'Scratchy', owner: { name: 'Bob' } };
   *
   * const people = from([magnus, terry, adam, john]);
   * const pets = from([barley, boots, whiskers, daisy, scratchy]);
   *
   * const result = people.join(
   *     pets,
   *     person => person,
   *     pet => pet.owner,
   *     (person, pet) => ({ ownerName: person.name, pet: pet.name }),
   *     (person, pet) => person.name === pet.owner.name
   *   )
   *   .toArray();
   *
   * expect(result).toEqual([
   *   { ownerName: 'Magnus', pet: 'Daisy' },
   *   { ownerName: 'Terry', pet: 'Barley' },
   *   { ownerName: 'Terry', pet: 'Boots' },
   *   { ownerName: 'Adam', pet: 'Whiskers' }
   * ]);
   * ```
   * @typeparam TInner The type of the elements of the second sequence.
   * @typeparam TKey The type of the keys returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param inner The second sequence to join to the first.
   * @param outerKeySelector A function to extract the join key from each element of the first sequence.
   * @param innerKeySelector A function to extract the join key from each element of the second sequence.
   * @param resultSelector A function to create a result element from two matching elements.
   * @param equalityComparer A function to compare keys.
   * @returns An IEnumerable<TResult> that has elements of type TResult that are obtained by performing an inner join on two sequences.
   */
  public join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: TInner) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  public join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: TInner) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyJoin(this.factory, this, inner, outerKeySelector, innerKeySelector, resultSelector, equalityComparer);
  }

  /**
   * Returns the last element of a sequence. Throws if sequence is empty.
   * @returns The value at the last position in the source sequence.
   */
  public last(): TSource;

  /**
   * Returns the last element of a sequence that satisfies a specified condition.
   * @param predicate A function to test each element for a condition.
   * @returns The last element in the sequence that passes the test in the specified predicate function.
   */
  public last(predicate: (item: TSource, index: number) => boolean): TSource;

  public last(predicate?: (item: TSource, index: number) => boolean): TSource {
    return last(this, predicate);
  }

  /**
   * Returns the last element of a sequence, or null if the sequence contains no elements.
   * @returns null if the source sequence is empty; otherwise, the last element in the IEnumerable<T>
   */
  public lastOrDefault(): TSource | null;

  /**
   * Returns the last element of a sequence that satisfies a condition or null if no such element is found.
   * @param predicate A function to test each element for a condition.
   * @returns null if the sequence is empty or if no elements pass the test in the predicate function; otherwise, the last element that passes the test in the predicate function.
   */
  public lastOrDefault(predicate: (item: TSource, index: number) => boolean): TSource | null;

  public lastOrDefault(predicate?: (item: TSource, index: number) => boolean): TSource | null {
    return lastOrDefault(this, predicate);
  }

  /**
   * Performs a left outer join on two heterogeneous sequences. Additional arguments specify key selection functions and result projection functions.
   * @param second The second sequence of the join operation.
   * @param firstKeySelector Function that projects the key given an element from first.
   * @param secondKeySelector Function that projects the key given an element from second.
   * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @returns A sequence containing results projected from a left outer join of the two input sequences.
   */
  public leftJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult
  ): IEnumerable<TResult>;

  /**
   * Performs a left outer join on two heterogeneous sequences. Additional arguments specify key selection functions and result projection functions.
   * @param second The second sequence of the join operation.
   * @param firstKeySelector Function that projects the key given an element from first.
   * @param secondKeySelector Function that projects the key given an element from second.
   * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a left outer join of the two input sequences.
   */
  public leftJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  public leftJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyLeftJoinHeterogeneous(
      this.factory,
      this,
      second,
      firstKeySelector,
      secondKeySelector,
      firstSelector,
      bothSelector,
      equalityComparer
    );
  }

  /**
   * Performs a left outer join on two homogeneous sequences. Additional arguments specify key selection functions and result projection functions.
   * @param second The second sequence of the join operation.
   * @param keySelector Function that projects the key given an element of one of the sequences to join.
   * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @returns A sequence containing results projected from a left outer join of the two input sequences.
   */
  public leftJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult
  ): IEnumerable<TResult>;

  /**
   * Performs a left outer join on two homogeneous sequences. Additional arguments specify key selection functions and result projection functions.
   * @param second The second sequence of the join operation.
   * @param keySelector Function that projects the key given an element of one of the sequences to join.
   * @param firstSelector Function that projects the result given just an element from first where there is no corresponding element in second.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a left outer join of the two input sequences.
   */
  public leftJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  public leftJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyLeftJoinHomogeneous(
      this.factory,
      this,
      second,
      keySelector,
      firstSelector,
      bothSelector,
      equalityComparer
    );
  }

  /**
   * Returns the maximum value in a sequence of values.
   * @returns The max value in the sequence.
   */
  public max(): TSource;

  /**
   * Invokes a transform function on each element of a generic sequence and returns the maximum resulting value.
   * @typeparam TResult The type of the value returned by selector.
   * @param selector A transform function to apply to each element.
   * @returns The maximum value in the sequence.
   */
  public max<TResult>(selector: (item: TSource) => TResult): TResult;

  public max<TResult>(selector?: (item: TSource) => TResult): TSource | TResult {
    return applyMax(this.factory, this, x => x, selector);
  }

  /**
   * Returns the maximum value in a generic sequence according to a specified key selector function.
   * @typeparam TKey The type of key to compare elements by.
   * @param keySelector A function to extract the key for each element.
   * @returns The value with the maximum key in the sequence.
   */
  public maxBy<TKey>(keySelector: (item: TSource) => TKey): TSource {
    return applyMax(this.factory, this, keySelector);
  }

  /**
   * Returns the min value in a sequence of values.
   * @returns The min value in the sequence.
   */
  public min(): TSource;

  /**
   * Invokes a transform function on each element of a generic sequence and returns the min resulting value.
   * @typeparam TResult The type of the value returned by selector.
   * @param selector A transform function to apply to each element.
   * @returns The min value in the sequence.
   */
  public min<TResult>(selector: (item: TSource) => TResult): TResult;

  public min<TResult>(selector?: (item: TSource) => TResult): TSource | TResult {
    return applyMin(this.factory, this, x => x, selector);
  }

  /**
   * Returns the min value in a generic sequence according to a specified key selector function.
   * @typeparam TKey The type of key to compare elements by.
   * @param keySelector A function to extract the key for each element.
   * @returns The value with the min key in the sequence.
   */
  public minBy<TKey>(keySelector: (item: TSource) => TKey): TSource {
    return applyMin(this.factory, this, keySelector);
  }

  /**
   * Filters the elements of an IEnumerable based on a specified type.
   * @typeparam TResult The type to filter the elements of the sequence on.
   * @param type The type to filter the elements of the sequence on.
   * @returns An IEnumerable<T> that contains elements from the input sequence of type TResult.
   */
  public ofType<TResult>(type: new (...params: unknown[]) => TResult): IEnumerable<TResult> {
    return applyOfType(this.factory, this, type) as IEnumerable<TResult>;
  }

  /**
   * Sorts the elements of a sequence in ascending order.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract the key for each element.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  public orderBy<TKey>(selector: (item: TSource) => TKey): IOrderedEnumerable<TSource>;

  /**
   * Sorts the elements of a sequence in ascending order.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract the key for each element.
   * @param comparer An Comparer<T> to compare keys.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  public orderBy<TKey>(selector: (item: TSource) => TKey, comparer: Comparer<TKey>): IOrderedEnumerable<TSource>;

  public orderBy<TKey>(selector: (item: TSource) => TKey, comparer?: Comparer<TKey>): IOrderedEnumerable<TSource> {
    return applyOrderBy(this.factory, this, true, selector, comparer);
  }

  /**
   * Sorts the elements of a sequence in descending order.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract the key for each element.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  public orderByDescending<TKey>(keySelector: (item: TSource) => TKey): IOrderedEnumerable<TSource>;

  /**
   * Sorts the elements of a sequence in descending order.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract the key for each element.
   * @param comparer An Comparer<T> to compare keys.
   * @returns An IOrderedEnumerable<TSource> whose elements are sorted according to a key.
   */
  public orderByDescending<TKey>(
    keySelector: (item: TSource) => TKey,
    comparer: Comparer<TKey>
  ): IOrderedEnumerable<TSource>;

  public orderByDescending<TKey>(
    keySelector: (item: TSource) => TKey,
    comparer?: Comparer<TKey>
  ): IOrderedEnumerable<TSource> {
    return applyOrderBy(this.factory, this, false, keySelector, comparer);
  }

  /**
   * Executes the given action on each element in the source sequence and yields it.
   * @param action The action to execute on each element.
   * @returns A sequence with source elements in their original order.
   */
  public pipe(action: (item: TSource, index: number) => void): IEnumerable<TSource> {
    return applyPipe(this.factory, this, action);
  }

  /**
   * Adds a value to the beginning of the sequence.
   * @param item The value to prepend to source.
   * @returns A new sequence that begins with item.
   */
  public prepend(item: TSource): IEnumerable<TSource> {
    return applyPrepend(this.factory, this, item);
  }

  /**
   * Computes the quantile of a sequence.
   * @param selector A function to extract a value from each element.
   * @param q The percentile to compute (25, 50, etc.)
   * @returns The percentile of the sequence.
   */
  public quantile(selector: (item: TSource) => number, q: number): number {
    return applyQuantile(this.factory, this, selector, q);
  }

  /**
   * Inverts the order of the elements in a sequence.
   * @returns A sequence whose elements correspond to those of the input sequence in reverse order.
   */
  public reverse(): IEnumerable<TSource> {
    return applyReverse(this.factory, this);
  }

  /**
   * Performs a right outer join on two heterogeneous sequences.
   * @example
   * ```typescript
   * const right = 'right';
   * const both = 'both';
   * const missing = null;
   *
   * type Side = typeof right | typeof both;
   * type Person = { name: string };
   * type Pet = { name: string; owner: Person };
   *
   * const magnus: Person = { name: 'Magnus' };
   * const terry: Person = { name: 'Terry' };
   * const adam: Person = { name: 'Adam' };
   * const john: Person = { name: 'John' };
   *
   * const barley: Pet = { name: 'Barley', owner: terry };
   * const boots: Pet = { name: 'Boots', owner: terry };
   * const whiskers: Pet = { name: 'Whiskers', owner: adam };
   * const daisy: Pet = { name: 'Daisy', owner: magnus };
   * const scratchy: Pet = { name: 'Scratchy', owner: { name: 'Bob' } };
   *
   * const people = from([magnus, terry, adam, john]);
   * const pets = from([barley, boots, whiskers, daisy, scratchy]);
   *
   * const result = people.rightJoinHeterogeneous<Pet, Person, { side: Side; left: Person | null; right: Pet }>(
   *     pets,
   *     person => person,
   *     pet => pet.owner,
   *     pet => ({ side: right, left: missing, right: pet }),
   *     (person, pet) => ({ side: both, left: person, right: pet })
   *   )
   *   .toArray();
   *
   * expect(result).toEqual([
   *   { side: both, left: terry, right: barley },
   *   { side: both, left: terry, right: boots },
   *   { side: both, left: adam, right: whiskers },
   *   { side: both, left: magnus, right: daisy },
   *   { side: right, left: missing, right: scratchy } // Scratchy has an owner, Bob, but Bob is not in the calling collection, hence the 'missing'.
   * ]);
   * ```
   * @typeparam TSecond The type of elements in the second sequence.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param firstKeySelector Function that projects the key given an element from first.
   * @param secondKeySelector Function that projects the key given an element from second.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  public rightJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult
  ): IEnumerable<TResult>;

  /**
   * Performs a right outer join on two heterogeneous sequences.
   * @example
   * ```typescript
   * const right = 'right';
   * const both = 'both';
   * const missing = null;
   *
   * type Side = typeof right | typeof both;
   * type Person = { name: string };
   * type Pet = { name: string; owner: Person };
   *
   * const magnus: Person = { name: 'Magnus' };
   * const terry: Person = { name: 'Terry' };
   * const adam: Person = { name: 'Adam' };
   * const john: Person = { name: 'John' };
   *
   * const barley: Pet = { name: 'Barley', owner: terry };
   * const boots: Pet = { name: 'Boots', owner: terry };
   * const whiskers: Pet = { name: 'Whiskers', owner: adam };
   * const daisy: Pet = { name: 'Daisy', owner: magnus };
   * const scratchy: Pet = { name: 'Scratchy', owner: { name: 'Bob' } };
   *
   * const people = from([magnus, terry, adam, john]);
   * const pets = from([barley, boots, whiskers, daisy, scratchy]);
   *
   * const result = people.rightJoinHeterogeneous<Pet, Person, { side: Side; left: Person | null; right: Pet }>(
   *     pets,
   *     person => person,
   *     pet => pet.owner,
   *     pet => ({ side: right, left: missing, right: pet }),
   *     (person, pet) => ({ side: both, left: person, right: pet }),
   *     (person, pet) => person.name === pet.owner.name
   *   )
   *   .toArray();
   *
   * expect(result).toEqual([
   *   { side: both, left: terry, right: barley },
   *   { side: both, left: terry, right: boots },
   *   { side: both, left: adam, right: whiskers },
   *   { side: both, left: magnus, right: daisy },
   *   { side: right, left: missing, right: scratchy } // Scratchy has an owner, Bob, but Bob is not in the calling collection, hence the 'missing'.
   * ]);
   * ```
   * @typeparam TSecond The type of elements in the second sequence.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param firstKeySelector Function that projects the key given an element from first.
   * @param secondKeySelector Function that projects the key given an element from second.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  public rightJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  public rightJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyRightJoinHeterogeneous(
      this.factory,
      this,
      second,
      firstKeySelector,
      secondKeySelector,
      secondSelector,
      bothSelector,
      equalityComparer
    );
  }

  /**
   * Performs a right outer join on two homogeneous sequences.
   * @example
   * ```typescript
   * const right = 'right';
   * const both = 'both';
   * const missing = null;
   *
   * type Side = typeof right | typeof both;
   * type Person = { id: number; name: string };
   *
   * const magnus: Person = { id: 1, name: 'Magnus' };
   * const terry1: Person = { id: 2, name: 'Terry' };
   * const adam: Person = { id: 3, name: 'Adam' };
   * const john1: Person = { id: 4, name: 'John' };
   * const john4: Person = { id: 9, name: 'John' };
   *
   * const john2: Person = { id: 5, name: 'John' };
   * const jane: Person = { id: 6, name: 'Jane' };
   * const terry2: Person = { id: 7, name: 'Terry' };
   * const john3: Person = { id: 8, name: 'John' };
   *
   * const people1 = from([magnus, terry1, adam, john1, john4]);
   * const people2 = from([john2, jane, terry2, john3]);
   *
   * const result = people1.rightJoinHomogeneous<string, { side: Side; left: Person | null; right: Person }>(
   *     people2,
   *     person => person.name,
   *     person => ({ side: right, left: missing, right: person }),
   *     (personLeft, personRight) => ({ side: both, left: personLeft, right: personRight })
   *   )
   *   .toArray();
   *
   * expect(result).toEqual([
   *   { side: both, left: john1, right: john2 },
   *   { side: both, left: john4, right: john2 },
   *   { side: right, left: missing, right: jane },
   *   { side: both, left: terry1, right: terry2 },
   *   { side: both, left: john1, right: john3 },
   *   { side: both, left: john4, right: john3 }
   * ]);
   * ```
   * @typeparam TSecond The type of elements in the second sequence.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param keySelector Function that projects the key given an element of one of the sequences to join.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  public rightJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult
  ): IEnumerable<TResult>;

  /**
   * Performs a right outer join on two homogeneous sequences.
   * @example
   * ```typescript
   * const right = 'right';
   * const both = 'both';
   * const missing = null;
   *
   * type Side = typeof right | typeof both;
   * type Person = { id: number; name: string };
   *
   * const magnus: Person = { id: 1, name: 'Magnus' };
   * const terry1: Person = { id: 2, name: 'Terry' };
   * const adam: Person = { id: 3, name: 'Adam' };
   * const john1: Person = { id: 4, name: 'John' };
   * const john4: Person = { id: 9, name: 'John' };
   *
   * const john2: Person = { id: 5, name: 'John' };
   * const jane: Person = { id: 6, name: 'Jane' };
   * const terry2: Person = { id: 7, name: 'Terry' };
   * const john3: Person = { id: 8, name: 'John' };
   *
   * const people1 = from([magnus, terry1, adam, john1, john4]);
   * const people2 = from([john2, jane, terry2, john3]);
   *
   * const result = people1.rightJoinHomogeneous<string, { side: Side; left: Person | null; right: Person }>(
   *     people2,
   *     person => person.name,
   *     person => ({ side: right, left: missing, right: person }),
   *     (personLeft, personRight) => ({ side: both, left: personLeft, right: personRight }),
   *     (keyLeft, keyRight) => keyLeft.toUpperCase() === keyRight.toUpperCase()
   *   )
   *   .toArray();
   *
   * expect(result).toEqual([
   *   { side: both, left: john1, right: john2 },
   *   { side: both, left: john4, right: john2 },
   *   { side: right, left: missing, right: jane },
   *   { side: both, left: terry1, right: terry2 },
   *   { side: both, left: john1, right: john3 },
   *   { side: both, left: john4, right: john3 }
   * ]);
   * ```
   * @typeparam TSecond The type of elements in the second sequence.
   * @typeparam TKey The type of the key returned by the key selector functions.
   * @typeparam TResult The type of the result elements.
   * @param second The second sequence of the join operation.
   * @param keySelector Function that projects the key given an element of one of the sequences to join.
   * @param secondSelector Function that projects the result given just an element from second where there is no corresponding element in first.
   * @param bothSelector Function that projects the result given an element from first and an element from second that match on a common key.
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  public rightJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TResult>;

  public rightJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): IEnumerable<TResult> {
    return applyRightJoinHomogeneous(
      this.factory,
      this,
      second,
      keySelector,
      secondSelector,
      bothSelector,
      equalityComparer
    );
  }

  /**
   * Projects each element of a sequence into a new form.
   * @typeparam TResult The type of the value returned by selector.
   * @param selector A transform function to apply to each element.
   * @returns An IEnumerable<T> whose elements are the result of invoking the transform function on each element of source.
   */
  public select<TResult>(selector: (item: TSource, index: number) => TResult): IEnumerable<TResult> {
    return applySelect(this.factory, this, selector);
  }

  /**
   * Projects each element of a sequence to an IEnumerable<T> and flattens the resulting sequences into one sequence.
   * @typeparam TResult The type of the value returned by selector.
   * @param selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
   * @returns An IEnumerable<T> whose elements are the result of invoking the one-to-many transform function on each element of an input sequence.
   */
  public selectMany<TResult>(selector: (item: TSource, index: number) => Iterable<TResult>): IEnumerable<TResult> {
    return applySelectMany(this.factory, this, selector);
  }

  /**
   * Determines whether two sequences are equal by comparing the elements.
   * @param second An IEnumerable<T> to compare to the first sequence.
   * @returns true if the two source sequences are of equal length and their corresponding elements are equal; otherwise, false.
   */
  public sequenceEqual(second: Iterable<TSource>): boolean;

  /**
   * Determines whether two sequences are equal by comparing their elements by using a specified EqualityComparer<T>.
   * @param second An IEnumerable<T> to compare to the first sequence.
   * @param equalityComparer An EqualityComparer<T> to use to compare elements.
   * @returns true if the two source sequences are of equal length and their corresponding elements compare equal according to equalityComparer; otherwise, false.
   */
  public sequenceEqual(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): boolean;

  public sequenceEqual(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): boolean {
    return sequenceEqual(this, second, equalityComparer);
  }

  /**
   * Returns a new IEnumerable<TSource> of the input sequence in random order.
   * @returns A new IEnumerable<TSource> of the input sequence in random order.
   */
  public shuffle(): IEnumerable<TSource> {
    return applyShuffle(this.factory, this);
  }

  /**
   * Returns the first element of a sequence, and throws an exception if more than one element exists.
   * @returns The single element of the input sequence that satisfies a condition.
   */
  public single(): TSource;

  /**
   * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
   * @param predicate A function to test an element for a condition.
   * @returns The single element of the input sequence that satisfies a condition.
   */
  public single(predicate: (item: TSource, index: number) => boolean): TSource;

  public single(predicate?: (item: TSource, index: number) => boolean): TSource {
    return single(this, predicate);
  }

  /**
   * Returns a single, specific element of a sequence, or null if that element is not found.
   * @returns The single element of the input sequence, or null if the sequence contains no elements.
   */
  public singleOrDefault(): TSource | null;

  /**
   * Returns the only element of a sequence that satisfies a specified condition or null if no such element exists; this method throws an exception if more than one element satisfies the condition.
   * @param predicate A function to test an element for a condition.
   * @returns The single element of the input sequence that satisfies the condition, or null if no such element is found.
   */
  public singleOrDefault(predicate: (item: TSource, index: number) => boolean): TSource | null;

  public singleOrDefault(predicate?: (item: TSource, index: number) => boolean): TSource | null {
    return singleOrDefault(this, predicate);
  }

  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   * @param count The number of elements to skip before returning the remaining elements.
   * @returns An IEnumerable<T> that contains the elements that occur after the specified index in the input sequence.
   */
  public skip(count: number): IEnumerable<TSource> {
    return applySkip(this.factory, this, count);
  }

  /**
   * Returns a new enumerable collection that contains the elements from source with the last count elements of the source collection omitted.
   * @param count The number of elements to omit from the end of the collection.
   * @returns A new enumerable collection that contains the elements from source minus count elements from the end of the collection.
   */
  public skipLast(count: number): IEnumerable<TSource> {
    return applySkipLast(this.factory, this, count);
  }

  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
   * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
   * @returns An IEnumerable<T> that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
   */
  public skipWhile(predicate: (item: TSource, index: number) => boolean): IEnumerable<TSource> {
    return applySkipWhile(this.factory, this, predicate);
  }

  /**
   * Splits the source sequence by a separator.
   * @param separator Separator element.
   * @returns A sequence of splits of elements.
   */
  public split(separator: TSource): IEnumerable<IEnumerable<TSource>>;

  /**
   * Splits the source sequence by a predicate.
   * @param predicate A function to test an element for a condition.
   * @returns A sequence of splits of elements.
   */
  public split(predicate: (item: TSource, index: number) => boolean): IEnumerable<IEnumerable<TSource>>;

  public split(
    separatorOrPredicate: TSource | ((item: TSource, index: number) => boolean)
  ): IEnumerable<IEnumerable<TSource>> {
    return applySplit(this.factory, this, separatorOrPredicate);
  }

  /**
   * Determines whether the beginning of the first sequence is equivalent to the second sequence.
   * @param second The sequence to compare to.
   * @returns true if first begins with elements equivalent to second.
   */
  public startsWith(second: Iterable<TSource>): boolean;

  /**
   * Determines whether the beginning of the first sequence is equivalent to the second sequence, using the specified element equality comparer.
   * @param second The sequence to compare to.
   * @param equalityComparer Equality comparer to use.
   * @returns true if first begins with elements equivalent to second.
   */
  public startsWith(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): boolean;

  public startsWith(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): boolean {
    return startsWith(this, second, equalityComparer);
  }

  /**
   * Computes the sum of a sequence of numeric values.
   * @returns The sum of the values in the sequence.
   */
  public sum(): number;

  /**
   * Computes the sum of the sequence of values that are obtained by invoking a transform function on each element of the input sequence.
   * @param selector A transform function to apply to each element.
   * @returns The sum of the projected values.
   */
  public sum(selector: (item: TSource) => number): number;

  public sum(selector?: (item: TSource) => number): number {
    return sum(this, selector);
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   * @returns An IEnumerable<T> that contains the specified number of elements from the start of the input sequence.
   */
  public take(count: number): IEnumerable<TSource> {
    return applyTake(this.factory, this, count);
  }

  /**
   * Returns every N-th element of a sequence.
   * @param step Number of elements to bypass before returning the next element.
   * @returns A sequence with every N-th element of the input sequence.
   */
  public takeEvery(step: number): IEnumerable<TSource> {
    return applyTakeEvery(this.factory, this, step);
  }

  /**
   * Returns a new enumerable collection that contains the last count elements from source.
   * @param count The number of elements to take from the end of the collection.
   * @returns A new enumerable collection that contains the last count elements from source.
   */
  public takeLast(count: number): IEnumerable<TSource> {
    return applyTakeLast(this.factory, this, count);
  }

  /**
   * Returns elements from a sequence as long as a specified condition is true, and then skips the remaining elements.
   * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
   * @returns An IEnumerable<T> that contains elements from the input sequence that occur before the element at which the test no longer passes.
   */
  public takeWhile(predicate: (item: TSource, index: number) => boolean): IEnumerable<TSource> {
    return applyTakeWhile(this.factory, this, predicate);
  }

  /**
   * Creates a new instance of the passed in ctor with the Enumerable as input.
   * Useful for custom iterables.
   * @example
   * ```typescript
   * class MyCustomEnumerable<T> extends Enumerable<T> {
   *   public foo(): void {
   *     console.log('hello');
   *   }
   * }
   *
   * const items = [1, 2, 3];
   *
   * const asCustom = from(items).to(MyCustomEnumerable); // asCustom is now a MyCustomEnumerable instance.
   * ```
   * @typeparam TResult The type of the returned object.
   * @param ctor The constructor function to create the result.
   * @returns A new instance of the passed in ctor with the enumerable passed as input.
   */
  public to<TResult>(ctor: new (src: Iterable<TSource>) => TResult): TResult {
    return to(this, ctor);
  }

  /**
   * Converts the source sequence into an array.
   * @returns A new array containing the elements of the source sequence.
   */
  public toArray(): TSource[] {
    return toArray(this);
  }

  /**
   * Returns a JSON string representation of the enumerable.
   * @returns A JSON string representation of the enumerable.
   */
  public toJSON(): string {
    return JSON.stringify(this.toArray());
  }

  /**
   * Converts the source sequence into list.
   * @returns A new list containing the elements of the source sequence.
   */
  public toList(): IList<TSource> {
    return this.factory.createList(this.srcGenerator);
  }

  /**
   * @deprecated Not yet implemented. Do not use.
   */
  public toLookup(): unknown {
    throw new Error('Not yet implemented');
  }

  /**
   * Creates a Map<TKey, TValue> from an IEnumerable<T> according to specified key selector.
   * @typeparam TKey The type of the key returned by keySelector.
   * @param keySelector A function to extract a key from each element.
   * @returns A Map<TKey, TSource> that contains keys and values.
   */
  public toMap<TKey>(keySelector: (item: TSource) => TKey): Map<TKey, TSource>;

  /**
   * Creates a Map<TKey, TValue> from an IEnumerable<T> according to specified key selector and element selector functions.
   * @typeparam TKey The type of the key returned by keySelector.
   * @typeparam TValue The type of the value returned by valueSelector.
   * @param keySelector A function to extract a key from each element.
   * @param valueSelector A transform function to produce a result element value from each element.
   * @returns A Map<TKey, TValue> that contains keys and values.
   */
  public toMap<TKey, TValue>(
    keySelector: (item: TSource) => TKey,
    valueSelector: (item: TSource) => TValue
  ): Map<TKey, TValue>;

  public toMap<TKey, TValue>(
    keySelector: (item: TSource) => TKey,
    valueSelector?: (item: TSource) => TValue
  ): Map<TKey, TSource | TValue> {
    return toMap(this, keySelector, valueSelector);
  }

  /**
   * Returns an object with keys selected by keySelector and values of TSource.
   * @param keySelector A function to extract a key from each element.
   * @returns An object with keys selected by keySelector and values of TSource
   */
  public toObject(keySelector: (item: TSource) => string): Record<string, TSource>;

  /**
   * Returns an object with keys selected by keySelector and values of TSource.
   * @typeparam TValue The type of the value returned by valueSelector.
   * @param keySelector A function to extract a key from each element.
   * @param valueSelector A transform function to produce a result element value from each element.
   * @returns An object with keys selected by keySelector and values of TSource
   */
  public toObject<TValue>(
    keySelector: (item: TSource) => string,
    valueSelector: (item: TSource) => TValue
  ): Record<string, TValue>;

  public toObject<TValue>(
    keySelector: (item: TSource) => string,
    valueSelector?: (item: TSource) => TValue
  ): Record<string, TSource | TValue> {
    return toObject(this, keySelector, valueSelector);
  }

  /**
   * Creates a Set<T> from an IEnumerable<T>.
   * @returns A Set<T> that contains values of type TSource selected from the input sequence.
   */
  public toSet(): Set<TSource> {
    return toSet(this);
  }

  /**
   * Returns a string representation of the enumerable.
   * @returns A string representation of the enumerable.
   */
  public toString(): string {
    return this.toArray().toString();
  }

  /**
   * Produces the set union of two sequences.
   * @param second One or more Iterable<T> whose distinct elements form the second set for the union.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  public union(...second: Iterable<TSource>[]): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  public union(second: Iterable<TSource>, equalityComparer: EqualityComparer<TSource>): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  public union(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
   * @param fourth An IEnumerable<T> whose distinct elements form the fourth set for the union.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  public union(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
    equalityComparer: EqualityComparer<TSource>
  ): IEnumerable<TSource>;

  public union(...second: (Iterable<TSource> | EqualityComparer<TSource>)[]): IEnumerable<TSource> {
    return applyUnion(this.factory, x => x, this, ...second);
  }

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  public unionBy<TKey>(second: Iterable<TSource>, keySelector: (item: TSource) => TKey): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  public unionBy<TKey>(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    keySelector: (item: TSource) => TKey
  ): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
   * @param fourth An IEnumerable<T> whose distinct elements form the fourth set for the union.
   * @param keySelector A function to extract the key for each element.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  public unionBy<TKey>(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
    keySelector: (item: TSource) => TKey
  ): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  public unionBy<TKey>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  public unionBy<TKey>(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  /**
   * Produces the set union of two sequences according to a specified key selector function.
   * @typeparam TKey The type of key to identify elements by.
   * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
   * @param third An IEnumerable<T> whose distinct elements form the third set for the union.
   * @param fourth An IEnumerable<T> whose distinct elements form the fourth set for the union.
   * @param keySelector A function to extract the key for each element.
   * @param equalityComparer The EqualityComparer<T> to compare values.
   * @returns An IEnumerable<T> that contains the elements from both input sequences, excluding duplicates.
   */
  public unionBy<TKey>(
    second: Iterable<TSource>,
    third: Iterable<TSource>,
    fourth: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer: EqualityComparer<TKey>
  ): IEnumerable<TSource>;

  public unionBy<TKey>(
    ...second: (Iterable<TSource> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
  ): IEnumerable<TSource> {
    return applyUnion<TSource, TKey>(this.factory, null, this, ...second);
  }

  /**
   * Filters a sequence of values based on a predicate.
   * @example
   * ```typescript
   * const items = [1, 2, 3, 4, 5];
   * const greaterThanTwo = from(items).where(x => x > 2); // Will be [3, 4, 5]
   * ```
   * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
   * @returns An IEnumerable<TSource> that contains elements from the input sequence that satisfy the condition.
   */
  public where(predicate: (item: TSource, index: number) => boolean): IEnumerable<TSource> {
    return applyWhere(this.factory, this, predicate);
  }

  /**
   * Processes a sequence into a series of subsequences representing a windowed subset of the original.
   * If size is greater than source.length, no subsequences will be returned.
   * @param size The size (number of elements) in each window.
   * @returns A series of sequences representing each sliding window subsequence.
   */
  public window(size: number): IEnumerable<IEnumerable<TSource>> {
    return applyWindow(this.factory, this, size);
  }

  /**
   * Produces a sequence of tuples with elements from the two specified sequences.
   * @typeparam TSecond The type of the elements of the second input sequence.
   * @param second The second sequence to merge.
   * @returns An IEnumerable<[TSource, TSecond]> that contains merged elements of two input sequences.
   */
  public zip<TSecond>(second: Iterable<TSecond>): IEnumerable<[TSource, TSecond]>;

  /**
   * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
   * @typeparam TSecond The type of the elements of the second input sequence.
   * @typeparam TResult The type of the elements of the result sequence.
   * @param second The second sequence to merge.
   * @param resultSelector A function that specifies how to merge the elements from the two sequences.
   * @returns An IEnumerable<TResult> that contains merged elements of two input sequences.
   */
  public zip<TSecond, TResult>(
    second: Iterable<TSecond>,
    resultSelector: (first: TSource, second: TSecond) => TResult
  ): IEnumerable<TResult>;

  public zip<TSecond, TResult>(
    second: Iterable<TSecond>,
    resultSelector?: (first: TSource, second: TSecond) => TResult
  ): IEnumerable<[TSource, TSecond] | TResult> {
    return applyZip(this.factory, this, second, resultSelector);
  }
}
