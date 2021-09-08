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
  where,
  zip,
  thenBy,
  join,
  groupJoin,
  leftJoinHeterogeneous,
  leftJoinHomogeneous,
  rightJoinHeterogeneous,
  rightJoinHomogeneous
} from '.';

export class Enumerable<TSource> implements Iterable<TSource> {
  private readonly srcGenerator: () => Generator<TSource>;

  public constructor(srcOrGenerator: (() => Generator<TSource>) | Iterable<TSource>) {
    if (typeof srcOrGenerator === 'function') {
      this.srcGenerator = srcOrGenerator;
    } else {
      if (Array.isArray(srcOrGenerator) || typeof srcOrGenerator === 'string') {
        this.srcGenerator = function* (): Generator<TSource> {
          // Traditional for loop is faster than for..of
          for (let i = 0; i < srcOrGenerator.length; i++) {
            yield srcOrGenerator[i];
          }
        };
      } else {
        this.srcGenerator = function* (): Generator<TSource> {
          for (const item of srcOrGenerator) {
            yield item;
          }
        };
      }
    }
  }

  public static from<TResult>(src: Iterable<TResult>): Enumerable<TResult> {
    return from(src);
  }

  public static empty<TResult>(): Enumerable<TResult> {
    return empty();
  }

  public static range(start: number, count: number): Enumerable<number> {
    return range(start, count);
  }

  public static repeat<TResult>(element: TResult, count: number): Enumerable<TResult> {
    return repeat(element, count);
  }

  public [Symbol.iterator](): Generator<TSource> {
    return this.srcGenerator();
  }

  public aggregate(aggregator: (prev: TSource, curr: TSource, index: number) => TSource): TSource;
  public aggregate<TAccumulate>(
    aggregator: (prev: TAccumulate, curr: TSource, index: number) => TAccumulate,
    seed: TAccumulate
  ): TAccumulate;
  public aggregate<TAccumulate>(
    aggregator: (prev: TAccumulate | TSource, curr: TSource, index: number) => TAccumulate | TSource,
    seed?: TAccumulate | TSource
  ): TAccumulate | TSource {
    return aggregate(this, aggregator, seed);
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   *
   * ```typescript
   * const numbers = [1, 2, 3, 4];
   * const areAllNumbersEven = from(numbers)
   *   .all(x => x % 2 === 0);
   * ```
   *
   * @param condition A function to test each element for a condition.
   * @returns true if every element of the source sequence passes the test in the specified predicate, or if the sequence is empty; otherwise, false.
   */
  public all(condition: (item: TSource, index: number) => boolean): boolean {
    return all(this, condition);
  }

  public any(condition?: (item: TSource, index: number) => boolean): boolean {
    return any(this, condition);
  }

  public append(item: TSource): Enumerable<TSource> {
    return append(this, item);
  }

  public asEnumerable(): Enumerable<TSource> {
    return asEnumerable(this);
  }

  public atLeast(count: number, predicate?: (item: TSource, index: number) => boolean): boolean {
    return atLeast(this, count, predicate);
  }

  public atMost(count: number, predicate?: (item: TSource, index: number) => boolean): boolean {
    return atMost(this, count, predicate);
  }

  public average(selector?: (item: TSource) => number): number {
    return average(this, selector);
  }

  public chunk(chunkSize: number): Enumerable<Enumerable<TSource>> {
    return chunk(this, chunkSize);
  }

  public concat(second: Iterable<TSource>): Enumerable<TSource> {
    return concat(this, second);
  }

  public contains(value: TSource, equalityComparer?: EqualityComparer<TSource>): boolean {
    return contains(this, value, equalityComparer);
  }

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

  public groupBy<TKey>(
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<Grouping<TKey, TSource>> {
    return groupBy(this, keySelector, equalityComparer);
  }

  /**
   * Correlates the elements of two sequences based on key equality, and groups the results.
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
   * Correlates the elements of two sequences based on matching keys.
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
    return leftJoinHeterogeneous(
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
    return leftJoinHomogeneous(this, second, keySelector, firstSelector, bothSelector, equalityComparer);
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

  public single(predicate?: (item: TSource) => boolean): TSource {
    throw new Error('Not yet implemented.');
  }

  public singleOrDefault(): TSource | null;
  public singleOrDefault(predicate: (item: TSource) => boolean): TSource | null;
  public singleOrDefault(defaultItem: TSource): TSource;
  public singleOrDefault(predicate: (item: TSource) => boolean, defaultItem: TSource): TSource;
  public singleOrDefault(
    predicateOrDefaultItem?: ((item: TSource) => boolean) | TSource,
    defaultItem?: TSource
  ): TSource | null {
    throw new Error('Not yet implemented.');
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
    return where(this, exp);
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

export class Grouping<TKey, TElement> extends Enumerable<TElement> {
  public readonly key: TKey;

  public constructor(key: TKey, src: Iterable<TElement>) {
    super(src);
    this.key = key;
  }
}
