import {
  from,
  empty,
  range,
  repeat,
  aggregate,
  all,
  any,
  append,
  asEnumerable,
  atLeast,
  atMost,
  average,
  chunk,
  concat,
  EqualityComparer,
  contains,
  count,
  defaultIfEmpty,
  distinct,
  distinctBy,
  elementAt,
  elementAtOrDefault,
  endsWith,
  except,
  exceptBy,
  first,
  firstOrDefault,
  forEach,
  groupBy,
  intersect,
  intersectBy,
  last,
  lastOrDefault,
  max,
  maxBy,
  min,
  minBy,
  ofType,
  Comparer,
  orderBy,
  pipe,
  prepend,
  quantile,
  reverse,
  select,
  selectMany,
  sequenceEqual,
  shuffle,
  skip,
  skipLast,
  skipWhile,
  startsWith,
  sum,
  take,
  takeEvery,
  takeLast,
  takeWhile,
  toArray,
  toMap,
  toObject,
  toSet,
  union,
  unionBy,
  zip,
  thenBy,
  join,
  groupJoin,
  rightJoinHeterogeneous,
  rightJoinHomogeneous,
  single,
  singleOrDefault,
  fullJoinHeterogeneous,
  fullJoinHomogeneous
} from '.';
import { leftJoinHeterogeneousGenerator, leftJoinHomogeneousGenerator } from './functions/generators/leftJoinGenerator';
import { whereGenerator } from './functions/generators/whereGenetator';

/**
 * Class that exposes an iterator, which supports a simple iteration and various methods.
 * @typeparam TSource The type of elements in the Enumerable.
 */
export class Enumerable<TSource> implements Iterable<TSource> {
  private readonly srcGenerator: () => Generator<TSource>;

  /**
   * Creates a new Enumerable.
   * @param srcOrGenerator The source Iterable or a Generator function.
   */
  public constructor(srcOrGenerator: () => Generator<TSource>) {
    this.srcGenerator = srcOrGenerator;
    // if (typeof srcOrGenerator === 'function') {
    //   this.srcGenerator = srcOrGenerator;
    // } else {
    //   if (Array.isArray(srcOrGenerator) || typeof srcOrGenerator === 'string') {
    //     this.srcGenerator = function* (): Generator<TSource> {
    //       // Traditional for loop is faster than for..of
    //       for (let i = 0; i < srcOrGenerator.length; i++) {
    //         yield srcOrGenerator[i];
    //       }
    //     };
    //   } else {
    //     this.srcGenerator = function* (): Generator<TSource> {
    //       for (const item of srcOrGenerator) {
    //         yield item;
    //       }
    //     };
    //   }
    // }
  }

  /**
   * Creates a new Enumerable from the input Iterable.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const enumerable = Enumerable.from(numbers);
   * ```
   * @param src The Iterable to create an Enumerable from.
   * @returns A new Enumerable.
   */
  public static from<TResult>(src: Iterable<TResult>): Enumerable<TResult>;

  /**
   * Creates a new Enumerable from the input object.
   * @example
   * ```typescript
   * const obj = {
   *   foo: 1,
   *   bar: 'b'
   * };
   * const enumerable = Enumerable.from(obj);
   * ```
   * @param src The object to create an Enumerable from.
   * @returns A new Enumerable.
   */
  public static from<TResult>(src: TResult): Enumerable<[keyof TResult, TResult[keyof TResult]]>;

  public static from<TResult>(src: Iterable<TResult>): Enumerable<TResult | [keyof TResult, TResult[keyof TResult]]> {
    return from(src);
  }

  /**
   * Creates an empty Enumerable.
   * @example
   * ```typescript
   * const empty = Enumerable.empty();
   * ```
   * @returns A new empty Enumerable.
   */
  public static empty<TResult>(): Enumerable<TResult> {
    return empty();
  }

  public static range(start: number, count: number): Enumerable<number> {
    return range(start, count);
  }

  public static repeat<TResult>(element: TResult, count: number): Enumerable<TResult> {
    return repeat(element, count);
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
   * @returns The iterator for the Enumerable.
   */
  public [Symbol.iterator](): Generator<TSource> {
    return this.srcGenerator();
  }

  /**
   * Applies an accumulator function over a sequence.
   * @param aggregator An accumulator function to be invoked on each element.
   * @returns The final accumulator value.
   */
  public aggregate(aggregator: (prev: TSource, curr: TSource, index: number) => TSource): TSource;

  /**
   * Applies an accumulator function over a sequence.
   * The specified seed value is used as the initial accumulator value, and the specified function is used to select the result value.
   * @typeparam TAccumulate The type of the accumulator value.
   * @typeparam TResult The type of the resulting value.
   * @param aggregator An accumulator function to be invoked on each element.
   * @param seed The initial accumulator value.
   * @param resultSelector An accumulator function to be invoked on each element.
   * @returns The final accumulator value.
   */
  public aggregate<TAccumulate, TResult>(
    aggregator: (prev: TAccumulate, curr: TSource, index: number) => TAccumulate,
    seed: TAccumulate,
    resultSelector: (accumulated: TAccumulate) => TResult
  ): TResult;

  /**
   * Applies an accumulator function over a sequence. The specified seed value is used as the initial accumulator value.
   * @typeparam TAccumulate The type of the accumulator value.
   * @param aggregator An accumulator function to be invoked on each element.
   * @param seed The initial accumulator value.
   * @returns The final accumulator value.
   */
  public aggregate<TAccumulate>(
    aggregator: (prev: TAccumulate, curr: TSource, index: number) => TAccumulate,
    seed: TAccumulate
  ): TAccumulate;

  public aggregate<TAccumulate, TResult>(
    aggregator: (prev: TAccumulate | TSource, curr: TSource, index: number) => TAccumulate | TSource,
    seed?: TAccumulate | TSource,
    resultSelector?: (accumulated: TAccumulate) => TResult
  ): TAccumulate | TSource | TResult {
    return aggregate(this, aggregator, seed, resultSelector);
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const areAllNumbersEven = from(numbers).all(x => x % 2 === 0); // false
   * ```
   * @param condition A function to test each element for a condition.
   * @returns true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
   */
  public all(condition: (item: TSource, index: number) => boolean): boolean {
    return all(this, condition);
  }

  /**
   * Determines whether any element of a sequence exists or satisfies a condition.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const areAnyNumbersEven = from(numbers).any(x => x % 2 === 0); // true
   * ```
   * @param condition A function to test each element for a condition.
   * @returns true if the source sequence contains any elements (or if at least one matches condition if condition is passed); otherwise, false.
   */
  public any(condition?: (item: TSource, index: number) => boolean): boolean {
    return any(this, condition);
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
  public append(item: TSource): Enumerable<TSource> {
    return append(this, item);
  }

  /**
   * Returns the input as an Enumerable.
   * @returns The input sequence as Enumerable.
   */
  public asEnumerable(): Enumerable<TSource> {
    return asEnumerable(this);
  }

  public atLeast(count: number, predicate?: (item: TSource, index: number) => boolean): boolean {
    return atLeast(this, count, predicate);
  }

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
   * @param selector A transform function to apply to each element.
   * @returns The average of the sequence of values.
   */
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
   * @returns An Enumerable<TSource> that contains the elements the input sequence split into chunks of size chunkSize.
   */
  public chunk(chunkSize: number): Enumerable<Enumerable<TSource>> {
    return chunk(this, chunkSize);
  }

  /**
   * Concatenates two sequences.
   * @example
   * ```typescript
   * const numbers = [1, 2];
   * const moreNumbers = from(numbers).concat([3, 4, 5]); // [1, 2, 3, 4, 5]
   * ```
   * @param second The sequence to concatenate to the first sequence.
   * @returns An Enumerable<TSource> that contains the concatenated elements of the two input sequences.
   */
  public concat(second: Iterable<TSource>): Enumerable<TSource> {
    return concat(this, second);
  }

  /**
   * Determines whether a sequence contains a specified element.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3];
   * const hasThree = from(numbers).contains(3); // true
   * ```
   * @param value The value to locate in the sequence.
   * @param equalityComparer An equality comparer to compare values.
   * @returns true if the source sequence contains an element that has the specified value; otherwise, false.
   */
  public contains(value: TSource, equalityComparer?: EqualityComparer<TSource>): boolean {
    return contains(this, value, equalityComparer);
  }

  /**
   * Returns the number of elements in a sequence.
   * @example
   * ```typescript
   * const numbers = [1, 2, 3];
   * const numCount = from(numbers).count(); // 3
   * const evenNumCount = from(numbers).count(x => x % 2 === 0); // 1
   * ```
   * @param condition A function to test each element for a condition.
   * @returns The number of elements in the input sequence.
   */
  public count(condition?: (item: TSource, index: number) => boolean): number {
    return count(this, condition);
  }

  public defaultIfEmpty(defaultItem: TSource): Enumerable<TSource> {
    return defaultIfEmpty(this, defaultItem);
  }

  public distinct(equalityComparer?: EqualityComparer<TSource>): Enumerable<TSource> {
    return distinct(this, equalityComparer);
  }

  public distinctBy<TKey>(
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TSource> {
    return distinctBy(this, keySelector, equalityComparer);
  }

  public elementAt(index: number): TSource {
    return elementAt(this, index);
  }

  public elementAtOrDefault(index: number): TSource | null {
    return elementAtOrDefault(this, index);
  }

  public endsWith(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): boolean {
    return endsWith(this, second, equalityComparer);
  }

  public except(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): Enumerable<TSource> {
    return except(this, second, equalityComparer);
  }

  public exceptBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TSource> {
    return exceptBy(this, second, keySelector, equalityComparer);
  }

  public first(condition?: (item: TSource, index: number) => boolean): TSource {
    return first(this, condition);
  }

  public firstOrDefault(condition?: (item: TSource, index: number) => boolean): TSource | null {
    return firstOrDefault(this, condition);
  }

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
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TResult> {
    return fullJoinHeterogeneous(
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
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a full outer join of the two input sequences.
   */
  public fullJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    firstSelector: (item: TSource) => TResult,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TResult> {
    return fullJoinHomogeneous(
      this,
      second,
      keySelector,
      firstSelector,
      secondSelector,
      bothSelector,
      equalityComparer
    );
  }

  public groupBy<TKey>(
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<Grouping<TKey, TSource>> {
    return groupBy(this, keySelector, equalityComparer);
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
   * @param equalityComparer An Enumerable<TResult> that contains elements of type TResult that are obtained by performing a grouped join on two sequences.
   */
  public groupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: Enumerable<TInner>) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TResult> {
    return groupJoin(this, inner, outerKeySelector, innerKeySelector, resultSelector, equalityComparer);
  }

  public intersect(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): Enumerable<TSource> {
    return intersect(this, second, equalityComparer);
  }

  public intersectBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TSource> {
    return intersectBy(this, second, keySelector, equalityComparer);
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
   * @param equalityComparer A function to compare keys.
   * @returns An Enumerable<TResult> that has elements of type TResult that are obtained by performing an inner join on two sequences.
   */
  public join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: TInner) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TResult> {
    return join(this, inner, outerKeySelector, innerKeySelector, resultSelector, equalityComparer);
  }

  public last(predicate?: (item: TSource, index: number) => boolean): TSource {
    return last(this, predicate);
  }

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
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a left outer join of the two input sequences.
   */
  public leftJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    firstSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TResult> {
    return new Enumerable(() =>
      leftJoinHeterogeneousGenerator(
        this,
        second,
        firstKeySelector,
        secondKeySelector,
        firstSelector,
        bothSelector,
        equalityComparer
      )
    );
  }

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
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TResult> {
    return new Enumerable(() =>
      leftJoinHomogeneousGenerator(this, second, keySelector, firstSelector, bothSelector, equalityComparer)
    );
  }

  public max(): TSource;
  public max<TResult>(selector: (item: TSource) => TResult): TResult;
  public max<TResult>(selector?: (item: TSource) => TResult): TSource | TResult {
    return max(this, selector);
  }

  public maxBy<TKey>(keySelector: (item: TSource) => TKey): TSource {
    return maxBy(this, keySelector);
  }

  public min(): TSource;
  public min<TResult>(selector: (item: TSource) => TResult): TResult;
  public min<TResult>(selector?: (item: TSource) => TResult): TSource | TResult {
    return min(this, selector);
  }

  public minBy<TKey>(keySelector: (item: TSource) => TKey): TSource {
    return minBy(this, keySelector);
  }

  public ofType<TResult>(type: new (...params: unknown[]) => TResult): Enumerable<TResult> {
    return ofType(this, type);
  }

  public orderBy<TKey>(selector: (item: TSource) => TKey, comparer?: Comparer<TKey>): OrderedEnumerable<TSource> {
    return orderBy(this, true, selector, comparer);
  }

  public orderByDescending<TKey>(
    selector: (item: TSource) => TKey,
    comparer?: Comparer<TKey>
  ): OrderedEnumerable<TSource> {
    return orderBy(this, false, selector, comparer);
  }

  public pipe(action: (item: TSource, index: number) => void): Enumerable<TSource> {
    return pipe(this, action);
  }

  public prepend(item: TSource): Enumerable<TSource> {
    return prepend(this, item);
  }

  public quantile(selector: (item: TSource) => number, q: number): number {
    return quantile(this, selector, q);
  }

  public reverse(): Enumerable<TSource> {
    return reverse(this);
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
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  public rightJoinHeterogeneous<TSecond, TKey, TResult>(
    second: Iterable<TSecond>,
    firstKeySelector: (item: TSource) => TKey,
    secondKeySelector: (item: TSecond) => TKey,
    secondSelector: (item: TSecond) => TResult,
    bothSelector: (a: TSource, b: TSecond) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TResult> {
    return rightJoinHeterogeneous(
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
   * @param equalityComparer A function to compare keys.
   * @returns A sequence containing results projected from a right outer join of the two input sequences.
   */
  public rightJoinHomogeneous<TKey, TResult>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    secondSelector: (item: TSource) => TResult,
    bothSelector: (a: TSource, b: TSource) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TResult> {
    return rightJoinHomogeneous(this, second, keySelector, secondSelector, bothSelector, equalityComparer);
  }

  public select<TDestination>(exp: (item: TSource, index: number) => TDestination): Enumerable<TDestination> {
    return select(this, exp);
  }

  public selectMany<TDestination>(exp: (item: TSource, index: number) => TDestination[]): Enumerable<TDestination> {
    return selectMany(this, exp);
  }

  public sequenceEqual(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): boolean {
    return sequenceEqual(this, second, equalityComparer);
  }

  public shuffle(): Enumerable<TSource> {
    return shuffle(this);
  }

  /**
   * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
   * @param predicate A function to test an element for a condition.
   * @returns The single element of the input sequence that satisfies a condition.
   */
  public single(predicate?: (item: TSource, index: number) => boolean): TSource {
    return single(this, predicate);
  }

  public singleOrDefault(predicate?: (item: TSource, index: number) => boolean): TSource | null {
    return singleOrDefault(this, predicate);
  }

  public skip(count: number): Enumerable<TSource> {
    return skip(this, count);
  }

  public skipLast(count: number): Enumerable<TSource> {
    return skipLast(this, count);
  }

  public skipWhile(predicate: (item: TSource, index: number) => boolean): Enumerable<TSource> {
    return skipWhile(this, predicate);
  }

  public startsWith(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): boolean {
    return startsWith(this, second, equalityComparer);
  }

  public sum(selector?: (item: TSource) => number): number {
    return sum(this, selector);
  }

  public take(count: number): Enumerable<TSource> {
    return take(this, count);
  }

  public takeEvery(step: number): Enumerable<TSource> {
    return takeEvery(this, step);
  }

  public takeLast(count: number): Enumerable<TSource> {
    return takeLast(this, count);
  }

  public takeWhile(predicate: (item: TSource, index: number) => boolean): Enumerable<TSource> {
    return takeWhile(this, predicate);
  }

  public toArray(): TSource[] {
    return toArray(this);
  }

  /**
   * @deprecated Not yet implemented. Do not use.
   */
  public toLookup(): unknown {
    throw new Error('Not yet implemented');
  }

  public toMap<TKey>(keySelector: (item: TSource) => TKey): Map<TKey, TSource>;
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

  public toObject(keySelector: (item: TSource) => string): Record<string, TSource>;
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

  public toSet(): Set<TSource> {
    return toSet(this);
  }

  public union(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): Enumerable<TSource> {
    return union(this, second, equalityComparer);
  }

  public unionBy<TKey>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TSource> {
    return unionBy(this, second, keySelector, equalityComparer);
  }

  public where(exp: (item: TSource, index: number) => boolean): Enumerable<TSource> {
    return new Enumerable(() => whereGenerator(this, exp));
  }

  public zip<TSecond>(second: Iterable<TSecond>): Enumerable<[TSource, TSecond]>;
  public zip<TSecond, TResult>(
    second: Iterable<TSecond>,
    resultSelector: (first: TSource, second: TSecond) => TResult
  ): Enumerable<TResult>;
  public zip<TSecond, TResult>(
    second: Iterable<TSecond>,
    resultSelector?: (first: TSource, second: TSecond) => TResult
  ): Enumerable<[TSource, TSecond] | TResult> {
    return zip(this, second, resultSelector);
  }
}

export class OrderedEnumerable<T> extends Enumerable<T> {
  private readonly orderedPairs: () => Generator<T[]>;

  public constructor(orderedPairs: () => Generator<T[]>) {
    super(function* (): Generator<T, void, undefined> {
      for (const pair of orderedPairs()) {
        yield* pair;
      }
    });

    this.orderedPairs = orderedPairs;
  }

  public thenBy<TKey>(selector: (item: T) => TKey, comparer?: Comparer<TKey>): OrderedEnumerable<T> {
    return thenBy(this.orderedPairs, true, selector, comparer);
  }

  public thenByDescending<TKey>(selector: (item: T) => TKey, comparer?: Comparer<TKey>): OrderedEnumerable<T> {
    return thenBy(this.orderedPairs, false, selector, comparer);
  }
}

export class Grouping<TKey, TSource> extends Enumerable<TSource> {
  public readonly key: TKey;

  public constructor(key: TKey, src: () => Generator<TSource>) {
    super(src);
    this.key = key;
  }
}
