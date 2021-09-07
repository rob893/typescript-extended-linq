import { aggregate } from './functions/aggregate';
import { except, exceptBy } from './functions/except';
import { groupBy } from './functions/groupBy';
import { intersect, intersectBy } from './functions/intersect';
import { orderBy } from './functions/orderBy';
import { range } from './functions/range';
import { repeat } from './functions/repeat';
import { select, selectMany } from './functions/select';
import { take, takeEvery, takeLast, takeWhile } from './functions/take';
import { thenBy } from './functions/thenBy';
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
    if (src instanceof Enumerable) {
      return src;
    }

    return new Enumerable(src);
  }

  public static empty<TResult>(): Enumerable<TResult> {
    return new Enumerable<TResult>([]);
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
    let i = 0;

    for (const item of this.srcGenerator()) {
      if (!condition(item, i)) {
        return false;
      }

      i++;
    }

    return true;
  }

  public any(condition?: (item: TSource, index: number) => boolean): boolean {
    if (!condition) {
      for (const _ of this.srcGenerator()) {
        return true;
      }
    } else if (condition) {
      let i = 0;

      for (const item of this.srcGenerator()) {
        if (condition(item, i)) {
          return true;
        }

        i++;
      }
    }

    return false;
  }

  public append(item: TSource): Enumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      for (const currentItem of src()) {
        yield currentItem;
      }

      yield item;
    }

    return new Enumerable(generator);
  }

  public asEnumerable(): Enumerable<TSource> {
    return new Enumerable(this.srcGenerator);
  }

  public atLeast(count: number, predicate?: (item: TSource, index: number) => boolean): boolean {
    let matches = 0;

    if (predicate) {
      let i = 0;

      for (const item of this.srcGenerator()) {
        if (predicate(item, i)) {
          matches++;

          if (matches >= count) {
            return true;
          }
        }

        i++;
      }
    } else {
      for (const _ of this.srcGenerator()) {
        matches++;

        if (matches >= count) {
          return true;
        }
      }
    }

    return false;
  }

  public atMost(count: number, predicate?: (item: TSource, index: number) => boolean): boolean {
    let matches = 0;

    if (predicate) {
      let i = 0;

      for (const item of this.srcGenerator()) {
        if (predicate(item, i)) {
          matches++;

          if (matches > count) {
            return false;
          }
        }

        i++;
      }
    } else {
      for (const _ of this.srcGenerator()) {
        matches++;

        if (matches > count) {
          return false;
        }
      }
    }

    return true;
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
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      for (const item of src()) {
        yield item;
      }

      if (Array.isArray(second) || typeof second === 'string') {
        for (let i = 0; i < second.length; i++) {
          yield second[i];
        }
      } else {
        for (const secondItem of second) {
          yield secondItem;
        }
      }
    }

    return new Enumerable(generator);
  }

  public contains(value: TSource, equalityComparer?: EqualityComparer<TSource>): boolean {
    if (equalityComparer) {
      for (const item of this.srcGenerator()) {
        if (equalityComparer(item, value)) {
          return true;
        }
      }
    } else {
      for (const item of this.srcGenerator()) {
        if (item === value) {
          return true;
        }
      }
    }

    return false;
  }

  public count(condition?: (item: TSource, index: number) => boolean): number {
    let count = 0;

    if (condition) {
      let i = 0;

      for (const item of this.srcGenerator()) {
        if (condition(item, i)) {
          count++;
        }

        i++;
      }
    } else {
      for (const _ of this.srcGenerator()) {
        count++;
      }
    }

    return count;
  }

  public defaultIfEmpty(defaultItem: TSource): Enumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      let returnDefault = true;

      for (const item of src()) {
        returnDefault = false;
        yield item;
      }

      if (returnDefault) {
        yield defaultItem;
      }
    }

    return new Enumerable(generator);
  }

  public distinct(equalityComparer?: EqualityComparer<TSource>): Enumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      if (!equalityComparer) {
        const seenItems = new Set<TSource>();

        for (const item of src()) {
          if (!seenItems.has(item)) {
            seenItems.add(item);
            yield item;
          }
        }
      } else {
        const seenitems: TSource[] = [];

        for (const item of src()) {
          let returnItem = true;

          for (let i = 0; i < seenitems.length; i++) {
            if (equalityComparer(item, seenitems[i])) {
              returnItem = false;
              break;
            }
          }

          if (returnItem) {
            seenitems.push(item);
            yield item;
          }
        }
      }
    }

    return new Enumerable(generator);
  }

  public distinctBy<TKey>(
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      if (!equalityComparer) {
        const seenKeys = new Set<TKey>();

        for (const item of src()) {
          const key = keySelector(item);

          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            yield item;
          }
        }
      } else {
        const seenKeys: TKey[] = [];

        for (const item of src()) {
          const key = keySelector(item);
          let returnItem = true;

          for (let i = 0; i < seenKeys.length; i++) {
            if (equalityComparer(key, seenKeys[i])) {
              returnItem = false;
              break;
            }
          }

          if (returnItem) {
            seenKeys.push(key);
            yield item;
          }
        }
      }
    }

    return new Enumerable(generator);
  }

  public elementAt(index: number): TSource {
    const element = this.elementAtOrDefault(index);

    if (element === null) {
      throw new Error('Index out of bounds');
    }

    return element;
  }

  public elementAtOrDefault(index: number): TSource | null {
    if (index < 0) {
      throw new Error('Index must be greater than or equal to 0');
    }

    let i = 0;

    for (const item of this.srcGenerator()) {
      if (i === index) {
        return item;
      }

      i++;
    }

    return null;
  }

  public endsWith(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): boolean {
    const src = [...this.srcGenerator()];
    const secondArr = Array.isArray(second) ? second : [...second];

    if (secondArr.length > src.length) {
      return false;
    }

    for (let i = src.length - secondArr.length, j = 0; i < src.length; i++, j++) {
      const srcItem = src[i];
      const secondItem = secondArr[j];

      if (equalityComparer) {
        if (!equalityComparer(srcItem, secondItem)) {
          return false;
        }
      } else {
        if (srcItem !== secondItem) {
          return false;
        }
      }
    }

    return true;
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
    const first = this.firstOrDefault(condition);

    if (first === null) {
      throw new Error('Sequence contains no elements.');
    }

    return first;
  }

  public firstOrDefault(condition?: (item: TSource, index: number) => boolean): TSource | null {
    if (!condition) {
      for (const item of this.srcGenerator()) {
        return item;
      }
    } else {
      let i = 0;

      for (const item of this.srcGenerator()) {
        if (condition(item, i)) {
          return item;
        }

        i++;
      }
    }

    return null;
  }

  public forEach(callback: (item: TSource, index: number) => void): void {
    let i = 0;

    for (const item of this.srcGenerator()) {
      callback(item, i);
      i++;
    }
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
    throw new Error('Not yeu implemented.');
  }

  public last(predicate?: (item: TSource, index: number) => boolean): TSource {
    const lastOrDefault = this.lastOrDefault(predicate);

    if (lastOrDefault === null) {
      throw new Error('Sequence contains no elements');
    }

    return lastOrDefault;
  }

  public lastOrDefault(predicate?: (item: TSource, index: number) => boolean): TSource | null {
    const arr = [...this.srcGenerator()];

    if (predicate) {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i], i)) {
          return arr[i];
        }
      }
    } else {
      if (arr.length > 0) {
        return arr[arr.length - 1];
      }
    }

    return null;
  }

  public max(): TSource;
  public max<TResult>(selector: (item: TSource) => TResult): TResult;
  public max<TResult>(selector?: (item: TSource) => TResult): TSource | TResult {
    if (!selector) {
      return this.aggregate((prev, curr) => (prev > curr ? prev : curr));
    }

    return this.select(selector).aggregate((prev, curr) => (prev > curr ? prev : curr));
  }

  public maxBy<TKey>(keySelector: (item: TSource) => TKey): TSource {
    return this.aggregate((prev, curr) => (keySelector(prev) >= keySelector(curr) ? prev : curr));
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
    const src = this.srcGenerator;

    function* generator(): Generator<TResult> {
      for (const item of src()) {
        if (item instanceof type) {
          yield item;
        }
      }
    }

    return new Enumerable(generator);
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
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      yield item;

      for (const currentItem of src()) {
        yield currentItem;
      }
    }

    return new Enumerable(generator);
  }

  public quantile(selector: (item: TSource) => number, q: number): number {
    const sorted = this.select(selector)
      .orderBy(x => x)
      .toArray();
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
      return sorted[base];
    }
  }

  public reverse(): Enumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      const items = [...src()];

      for (let i = items.length - 1; i >= 0; i--) {
        yield items[i];
      }
    }

    return new Enumerable(generator);
  }

  public select<TDestination>(exp: (item: TSource, index: number) => TDestination): Enumerable<TDestination> {
    return select(this, exp);
  }

  public selectMany<TDestination>(exp: (item: TSource, index: number) => TDestination[]): Enumerable<TDestination> {
    return selectMany(this, exp);
  }

  public sequenceEqual(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): boolean {
    const firstArr = [...this.srcGenerator()];
    const secondArr = Array.isArray(second) || typeof second === 'string' ? second : [...second];

    if (firstArr.length !== secondArr.length) {
      return false;
    }

    for (let i = 0; i < firstArr.length; i++) {
      if (equalityComparer) {
        if (!equalityComparer(firstArr[i], secondArr[i])) {
          return false;
        }
      } else {
        if (firstArr[i] !== secondArr[i]) {
          return false;
        }
      }
    }

    return true;
  }

  public shuffle(): Enumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      const array = [...src()];
      let currentIndex = array.length,
        temporaryValue,
        randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;

        yield array[currentIndex];
      }
    }

    return new Enumerable(generator);
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
    if (count <= 0) {
      throw new Error('Count must be greater than 0');
    }

    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      let i = 0;

      for (const item of src()) {
        i++;

        if (i > count) {
          yield item;
        }
      }
    }

    return new Enumerable(generator);
  }

  public skipLast(count: number): Enumerable<TSource> {
    if (count <= 0) {
      throw new Error('Count must be greater than 0');
    }

    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      const arr = [...src()];

      for (let i = 0; i < arr.length - count; i++) {
        yield arr[i];
      }
    }

    return new Enumerable(generator);
  }

  public skipWhile(predicate: (item: TSource, index: number) => boolean): Enumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      let i = 0;
      let keepSkipping = true;

      for (const item of src()) {
        if (keepSkipping) {
          if (!predicate(item, i)) {
            keepSkipping = false;
          }
        }

        if (!keepSkipping) {
          yield item;
        }

        i++;
      }
    }

    return new Enumerable(generator);
  }

  public startsWith(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): boolean {
    const src = [...this.srcGenerator()];
    const secondArr = Array.isArray(second) ? second : [...second];

    if (secondArr.length > src.length) {
      return false;
    }

    for (let i = 0; i < secondArr.length; i++) {
      const srcItem = src[i];
      const secondItem = secondArr[i];

      if (equalityComparer) {
        if (!equalityComparer(srcItem, secondItem)) {
          return false;
        }
      } else {
        if (srcItem !== secondItem) {
          return false;
        }
      }
    }

    return true;
  }

  public sum(selector?: (item: TSource) => number): number {
    if (!selector) {
      return this.aggregate((prev, curr) => {
        if (typeof curr !== 'number') {
          throw new Error('sum can only be used with numbers');
        }

        return prev + curr;
      });
    }

    return this.aggregate((prev, curr) => prev + selector(curr), 0);
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
    const map = new Map<TKey, TSource | TValue>();

    if (valueSelector) {
      for (const item of this.srcGenerator()) {
        const key = keySelector(item);
        map.set(key, valueSelector(item));
      }
    } else {
      for (const item of this.srcGenerator()) {
        const key = keySelector(item);
        map.set(key, item);
      }
    }

    return map;
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
    const obj: Record<string, TSource | TValue> = {};

    if (valueSelector) {
      for (const item of this.srcGenerator()) {
        const key = keySelector(item);
        obj[key] = valueSelector(item);
      }
    } else {
      for (const item of this.srcGenerator()) {
        const key = keySelector(item);
        obj[key] = item;
      }
    }

    return obj;
  }

  public toSet(): Set<TSource> {
    return new Set(this);
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
