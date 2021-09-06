import { Comparer, EqualityComparer } from './types';

export function from<TSource>(src: Iterable<TSource>): Enumerable<TSource> {
  return Enumerable.from(src);
}

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
    return new Enumerable(src);
  }

  public static empty<TResult>(): Enumerable<TResult> {
    return new Enumerable<TResult>([]);
  }

  public static range(start: number, count: number): Enumerable<number> {
    if (count < 0) {
      throw new Error('Count must be greater than or equal to 0');
    }

    if (start + count >= Number.MAX_SAFE_INTEGER) {
      throw new Error('start + count must be less than Number.MAX_SAFE_INTEGER');
    }

    function* generator(): Generator<number> {
      for (let i = start; i < start + count; i++) {
        yield i;
      }
    }

    return new Enumerable(generator);
  }

  public static repeat<TResult>(element: TResult, count: number): Enumerable<TResult> {
    if (count < 0) {
      throw new Error('Count must be greater than or equal to 0');
    }

    function* generator(): Generator<TResult> {
      for (let i = 0; i < count; i++) {
        yield element;
      }
    }

    return new Enumerable(generator);
  }

  protected static toKeyMap<TKey, T>(
    src: (() => Generator<T>) | Iterable<T>,
    keySelector: (item: T) => TKey
  ): Map<TKey, T[]> {
    const map = new Map<TKey, T[]>();
    const srcIterable = typeof src === 'function' ? src() : src;

    for (const item of srcIterable) {
      const key = keySelector(item);
      const curr = map.get(key);

      if (curr !== undefined) {
        curr.push(item);
      } else {
        map.set(key, [item]);
      }
    }

    return map;
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
    let aggregate = seed;
    let i = 0;

    for (const item of this.srcGenerator()) {
      if (aggregate === undefined) {
        aggregate = item;
      } else {
        aggregate = aggregator(aggregate, item, i);
      }

      i++;
    }

    if (aggregate === undefined) {
      throw new Error('Sequence contains no elements');
    }

    return aggregate;
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
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      const secondSet: Set<TSource> = second instanceof Set ? second : new Set(second);

      if (equalityComparer) {
        for (const item of src()) {
          let returnItem = true;

          for (const secondItem of secondSet) {
            if (equalityComparer(item, secondItem)) {
              returnItem = false;
              break;
            }
          }

          if (returnItem) {
            secondSet.add(item);
            yield item;
          }
        }
      } else {
        for (const item of src()) {
          if (!secondSet.has(item)) {
            secondSet.add(item);
            yield item;
          }
        }
      }
    }

    return new Enumerable(generator);
  }

  public exceptBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      const secondKeySet: Set<TKey> = second instanceof Set ? second : new Set(second);

      if (equalityComparer) {
        for (const item of src()) {
          const key = keySelector(item);
          let returnItem = true;

          for (const secondItemKey of secondKeySet) {
            if (equalityComparer(key, secondItemKey)) {
              returnItem = false;
              break;
            }
          }

          if (returnItem) {
            secondKeySet.add(key);
            yield item;
          }
        }
      } else {
        for (const item of src()) {
          const key = keySelector(item);

          if (!secondKeySet.has(key)) {
            secondKeySet.add(key);
            yield item;
          }
        }
      }
    }

    return new Enumerable(generator);
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
    const src = this.srcGenerator;

    function* generator(): Generator<Grouping<TKey, TSource>> {
      if (equalityComparer) {
        const groupings: [TKey, TSource[]][] = [];

        for (const item of src()) {
          const key = keySelector(item);
          let groupExists = false;

          for (let i = 0; i < groupings.length; i++) {
            const [groupKey, group] = groupings[i];

            if (equalityComparer(key, groupKey)) {
              groupExists = true;
              group.push(item);
            }
          }

          if (!groupExists) {
            groupings.push([key, [item]]);
          }
        }

        for (let i = 0; i < groupings.length; i++) {
          const [groupKey, group] = groupings[i];
          yield new Grouping(groupKey, group);
        }
      } else {
        for (const [key, value] of Enumerable.toKeyMap(src, keySelector)) {
          yield new Grouping(key, value);
        }
      }
    }

    return new Enumerable(generator);
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
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      const secondSet: Set<TSource> = second instanceof Set ? second : new Set(second);

      if (equalityComparer) {
        for (const item of src()) {
          let returnItem = false;
          let toDelete: TSource | null = null;

          for (const secondItem of secondSet) {
            if (equalityComparer(item, secondItem)) {
              toDelete = secondItem;
              returnItem = true;
              break;
            }
          }

          if (toDelete !== null) {
            secondSet.delete(toDelete);
          }

          if (returnItem) {
            yield item;
          }
        }
      } else {
        for (const item of src()) {
          if (secondSet.delete(item)) {
            yield item;
          }
        }
      }
    }

    return new Enumerable(generator);
  }

  public intersectBy<TKey>(
    second: Iterable<TKey>,
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      const secondKeySet: Set<TKey> = second instanceof Set ? second : new Set(second);

      if (equalityComparer) {
        for (const item of src()) {
          const key = keySelector(item);
          let returnItem = false;
          let toDeleteKey: TKey | null = null;

          for (const secondItemKey of secondKeySet) {
            if (equalityComparer(key, secondItemKey)) {
              toDeleteKey = secondItemKey;
              returnItem = true;
              break;
            }
          }

          if (toDeleteKey !== null) {
            secondKeySet.delete(toDeleteKey);
          }

          if (returnItem) {
            yield item;
          }
        }
      } else {
        for (const item of src()) {
          if (secondKeySet.delete(keySelector(item))) {
            yield item;
          }
        }
      }
    }

    return new Enumerable(generator);
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
    const src = this.srcGenerator;

    function* generator(): Generator<TSource[]> {
      const map = Enumerable.toKeyMap(src, selector);
      const sortedKeys = [...map.keys()].sort((a, b) => {
        if (comparer) {
          return comparer(a, b);
        }

        if (a > b) {
          return 1;
        } else if (a < b) {
          return -1;
        } else {
          return 0;
        }
      });

      for (let i = 0; i < sortedKeys.length; i++) {
        const items = map.get(sortedKeys[i]);
        yield items ?? [];
      }
    }

    return new OrderedEnumerable(generator);
  }

  public orderByDescending<TKey>(
    selector: (item: TSource) => TKey,
    comparer?: Comparer<TKey>
  ): OrderedEnumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource[]> {
      const map = Enumerable.toKeyMap(src, selector);
      const sortedKeys = [...map.keys()].sort((a, b) => {
        if (comparer) {
          return comparer(a, b);
        }

        if (a < b) {
          return 1;
        } else if (a > b) {
          return -1;
        } else {
          return 0;
        }
      });

      for (let i = 0; i < sortedKeys.length; i++) {
        const items = map.get(sortedKeys[i]);
        yield items ?? [];
      }
    }

    return new OrderedEnumerable(generator);
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
    const src = this.srcGenerator;

    function* generator(): Generator<TDestination> {
      let i = 0;

      for (const item of src()) {
        yield exp(item, i);
        i++;
      }
    }

    return new Enumerable(generator);
  }

  public selectMany<TDestination>(exp: (item: TSource, index: number) => TDestination[]): Enumerable<TDestination> {
    const src = this.srcGenerator;

    function* generator(): Generator<TDestination> {
      let i = 0;

      for (const item of src()) {
        for (const subItem of exp(item, i)) {
          yield subItem;
        }

        i++;
      }
    }

    return new Enumerable(generator);
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
    if (count <= 0) {
      throw new Error('Count must be greater than 0');
    }

    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      let i = 0;

      for (const item of src()) {
        if (i >= count) {
          return;
        }

        i++;
        yield item;
      }
    }

    return new Enumerable(generator);
  }

  public takeEvery(step: number): Enumerable<TSource> {
    if (step <= 0) {
      throw new Error('Count must be greater than 0');
    }

    return this.where((_, i) => i % step === 0);
  }

  public takeLast(count: number): Enumerable<TSource> {
    if (count <= 0) {
      throw new Error('Count must be greater than 0');
    }

    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      const arr = [...src()];

      for (let i = Math.max(arr.length - count, 0); i < arr.length; i++) {
        yield arr[i];
      }
    }

    return new Enumerable(generator);
  }

  public takeWhile(predicate: (item: TSource, index: number) => boolean): Enumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      let i = 0;

      for (const item of src()) {
        if (!predicate(item, i)) {
          return;
        }

        i++;
        yield item;
      }
    }

    return new Enumerable(generator);
  }

  public toArray(): TSource[] {
    return [...this.srcGenerator()];
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
    return new Set(this.srcGenerator());
  }

  public union(second: Iterable<TSource>, equalityComparer?: EqualityComparer<TSource>): Enumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      if (equalityComparer) {
        const seen: TSource[] = [];

        for (const source of [src(), second]) {
          for (const item of source) {
            let returnItem = true;

            for (let i = 0; i < seen.length; i++) {
              if (equalityComparer(item, seen[i])) {
                returnItem = false;
                break;
              }
            }

            if (returnItem) {
              seen.push(item);
              yield item;
            }
          }
        }
      } else {
        for (const item of new Set([...src(), ...second])) {
          yield item;
        }
      }
    }

    return new Enumerable(generator);
  }

  public unionBy<TKey>(
    second: Iterable<TSource>,
    keySelector: (item: TSource) => TKey,
    equalityComparer?: EqualityComparer<TKey>
  ): Enumerable<TSource> {
    const src = this.srcGenerator;

    function* generator(): Generator<TSource> {
      if (equalityComparer) {
        const seenKeys: TKey[] = [];

        for (const source of [src(), second]) {
          for (const item of source) {
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
      } else {
        const seenKeys = new Set<TKey>();

        for (const source of [src(), second]) {
          for (const item of source) {
            const key = keySelector(item);

            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              yield item;
            }
          }
        }
      }
    }

    return new Enumerable(generator);
  }

  public where(exp: (item: TSource, index: number) => boolean): Enumerable<TSource> {
    const items = this.srcGenerator;

    function* generator(): Generator<TSource> {
      let i = 0;

      for (const item of items()) {
        if (exp(item, i)) {
          yield item;
        }

        i++;
      }
    }

    return new Enumerable(generator);
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
    const src = this.srcGenerator;

    function* generator(): Generator<[TSource, TSecond] | TResult> {
      const firstArr = [...src()];
      const secondArr = Array.isArray(second) || typeof second === 'string' ? second : [...second];

      const limit = Math.min(firstArr.length, secondArr.length);

      for (let i = 0; i < limit; i++) {
        if (resultSelector) {
          yield resultSelector(firstArr[i], secondArr[i]);
        } else {
          yield [firstArr[i], secondArr[i]];
        }
      }
    }

    return new Enumerable(generator);
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
    const pairs = this.orderedPairs;

    function* generator(): Generator<T[]> {
      for (const pair of pairs()) {
        const subGenerator = function* (): Generator<T[]> {
          const map = Enumerable.toKeyMap(pair, selector);
          const sortedKeys = [...map.keys()].sort((a, b) => {
            if (comparer) {
              return comparer(a, b);
            }

            if (a > b) {
              return 1;
            } else if (a < b) {
              return -1;
            } else {
              return 0;
            }
          });

          for (let i = 0; i < sortedKeys.length; i++) {
            const items = map.get(sortedKeys[i]);
            yield items ?? [];
          }
        };

        yield* subGenerator();
      }
    }

    return new OrderedEnumerable(generator);
  }

  public thenByDescending<TKey>(selector: (item: T) => TKey, comparer?: Comparer<TKey>): OrderedEnumerable<T> {
    const pairs = this.orderedPairs;

    function* generator(): Generator<T[]> {
      for (const pair of pairs()) {
        const subGenerator = function* (): Generator<T[]> {
          const map = Enumerable.toKeyMap(pair, selector);
          const sortedKeys = [...map.keys()].sort((a, b) => {
            if (comparer) {
              return comparer(a, b);
            }

            if (a < b) {
              return 1;
            } else if (a > b) {
              return -1;
            } else {
              return 0;
            }
          });

          for (let i = 0; i < sortedKeys.length; i++) {
            const items = map.get(sortedKeys[i]);
            yield items ?? [];
          }
        };

        yield* subGenerator();
      }
    }

    return new OrderedEnumerable(generator);
  }
}

export class Grouping<TKey, TElement> extends Enumerable<TElement> {
  public readonly key: TKey;

  public constructor(key: TKey, src: Iterable<TElement>) {
    super(src);
    this.key = key;
  }
}
