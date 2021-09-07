import { from } from './functions/from';
import { aggregate } from './functions/aggregate';
import { all } from './functions/all';
import { any } from './functions/any';
import { append } from './functions/append';
import { atLeast } from './functions/atLeast';
import { atMost } from './functions/atMost';
import { concat } from './functions/concat';
import { contains } from './functions/contains';
import { count } from './functions/count';
import { defaultIfEmpty } from './functions/defaultIfEmpty';
import { distinct, distinctBy } from './functions/distinct';
import { elementAt, elementAtOrDefault } from './functions/elementAt';
import { empty } from './functions/empty';
import { endsWith } from './functions/endsWith';
import { except, exceptBy } from './functions/except';
import { first, firstOrDefault } from './functions/first';
import { forEach } from './functions/forEach';
import { groupBy } from './functions/groupBy';
import { intersect, intersectBy } from './functions/intersect';
import { last, lastOrDefault } from './functions/last';
import { max, maxBy } from './functions/max';
import { ofType } from './functions/ofType';
import { orderBy } from './functions/orderBy';
import { prepend } from './functions/prepend';
import { quantile } from './functions/quantile';
import { range } from './functions/range';
import { repeat } from './functions/repeat';
import { reverse } from './functions/reverse';
import { select, selectMany } from './functions/select';
import { sequenceEqual } from './functions/sequenceEqual';
import { shuffle } from './functions/shuffle';
import { skip, skipLast, skipWhile } from './functions/skip';
import { startsWith } from './functions/startsWith';
import { sum } from './functions/sum';
import { take, takeEvery, takeLast, takeWhile } from './functions/take';
import { thenBy } from './functions/thenBy';
import { toMap } from './functions/toMap';
import { toObject } from './functions/toObject';
import { toSet } from './functions/toSet';
import { union, unionBy } from './functions/union';
import { where } from './functions/where';
import { zip } from './functions/zip';
import { Comparer, EqualityComparer } from './types';

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

  public aggregate<T>(aggregator: (prev: T, curr: T, index: number) => T): T;
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
    return new Enumerable(this.srcGenerator);
  }

  public atLeast(count: number, predicate?: (item: TSource, index: number) => boolean): boolean {
    return atLeast(this, count, predicate);
  }

  public atMost(count: number, predicate?: (item: TSource, index: number) => boolean): boolean {
    return atMost(this, count, predicate);
  }

  public average(selector?: (item: TSource) => number): number {
    return this.sum(selector) / this.count();
  }

  public chunk(chunkSize: number): Enumerable<Enumerable<TSource>> {
    return this.select((x, i) => ({ index: i, value: x }))
      .groupBy(x => Math.floor(x.index / chunkSize))
      .select(x => x.select(v => v.value));
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

  public groupJoin<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: Iterable<TInner>) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TResult> {
    throw new Error('Not yet implemented');
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

  public join<TInner, TKey, TResult>(
    inner: Iterable<TInner>,
    outerKeySelector: (item: TSource) => TKey,
    innerKeySelector: (item: TInner) => TKey,
    resultSelector: (item: TSource, inner: TInner) => TResult,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TResult> {
    throw new Error('Not yet implemented.');
  }

  public last(predicate?: (item: TSource, index: number) => boolean): TSource {
    return last(this, predicate);
  }

  public lastOrDefault(predicate?: (item: TSource, index: number) => boolean): TSource | null {
    return lastOrDefault(this, predicate);
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
    if (!selector) {
      return this.aggregate((prev, curr) => (prev < curr ? prev : curr));
    }

    return this.select(selector).aggregate((prev, curr) => (prev < curr ? prev : curr));
  }

  public minBy<TKey>(keySelector: (item: TSource) => TKey): TSource {
    return this.aggregate((prev, curr) => (keySelector(prev) <= keySelector(curr) ? prev : curr));
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

  public prepend(item: TSource): Enumerable<TSource> {
    return prepend(this, item);
  }

  public quantile(selector: (item: TSource) => number, q: number): number {
    return quantile(this, selector, q);
  }

  public reverse(): Enumerable<TSource> {
    return reverse(this);
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
    return [...this];
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
