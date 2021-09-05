export function from<T>(src: Iterable<T>): Enumerable<T> {
  return new Enumerable(src);
}

export class Enumerable<T> implements Iterable<T> {
  private readonly srcGenerator: () => Generator<T>;

  public constructor(srcOrGenerator: (() => Generator<T>) | Iterable<T>) {
    if (typeof srcOrGenerator === 'function') {
      this.srcGenerator = srcOrGenerator;
    } else {
      if (Array.isArray(srcOrGenerator) || typeof srcOrGenerator === 'string') {
        this.srcGenerator = function* (): Generator<T> {
          for (let i = 0; i < srcOrGenerator.length; i++) {
            yield srcOrGenerator[i];
          }
        };
      } else {
        this.srcGenerator = function* (): Generator<T> {
          for (const item of srcOrGenerator) {
            yield item;
          }
        };
      }
    }
  }

  public [Symbol.iterator](): Generator<T> {
    return this.srcGenerator();
  }

  public forEach(callback: (item: T, index: number) => void): void {
    let i = 0;

    for (const item of this.srcGenerator()) {
      callback(item, i);
      i++;
    }
  }

  public where(exp: (item: T, index: number) => boolean): Enumerable<T> {
    const items = this.srcGenerator;

    function* generator(): Generator<T> {
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

  public aggregate<T>(aggregator: (prev: T, curr: T, index: number) => T): T;
  public aggregate<TAccumulate>(
    aggregator: (prev: TAccumulate, curr: T, index: number) => TAccumulate,
    seed: TAccumulate
  ): TAccumulate;
  public aggregate<TAccumulate>(
    aggregator: (prev: TAccumulate | T, curr: T, index: number) => TAccumulate | T,
    seed?: TAccumulate | T
  ): TAccumulate | T {
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

  public orderBy(selector: (item: T) => string | number | boolean): Enumerable<T> {
    const src = this.srcGenerator;

    function* generator(): Generator<T> {
      const sorted = [...src()].sort((a, b) => {
        const aComp = selector(a);
        const bComp = selector(b);

        if (aComp > bComp) {
          return 1;
        } else if (aComp < bComp) {
          return -1;
        } else {
          return 0;
        }
      });

      for (const item of sorted) {
        yield item;
      }
    }

    return new Enumerable(generator);
  }

  public orderByDescending(selector: (item: T) => string | number | boolean): Enumerable<T> {
    const src = this.srcGenerator;

    function* generator(): Generator<T> {
      const sorted = [...src()].sort((a, b) => {
        const aComp = selector(a);
        const bComp = selector(b);

        if (aComp < bComp) {
          return 1;
        } else if (aComp > bComp) {
          return -1;
        } else {
          return 0;
        }
      });

      for (const item of sorted) {
        yield item;
      }
    }

    return new Enumerable(generator);
  }

  public count(condition?: (item: T, index: number) => boolean): number {
    let count = 0;
    let i = 0;

    for (const item of this.srcGenerator()) {
      if (!condition) {
        count++;
      } else if (condition(item, i)) {
        count++;
      }

      i++;
    }

    return count;
  }

  public any(condition?: (item: T, index: number) => boolean): boolean {
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

  public all(condition: (item: T, index: number) => boolean): boolean {
    let i = 0;

    for (const item of this.srcGenerator()) {
      if (!condition(item, i)) {
        return false;
      }

      i++;
    }

    return true;
  }

  public first(condition?: (item: T, index: number) => boolean): T {
    const first = this.firstOrDefault(condition);

    if (first === null) {
      throw new Error('Sequence contains no elements.');
    }

    return first;
  }

  public firstOrDefault(condition?: (item: T, index: number) => boolean): T | null {
    let i = 0;

    for (const item of this.srcGenerator()) {
      if (!condition) {
        return item;
      } else if (condition(item, i)) {
        return item;
      }

      i++;
    }

    return null;
  }

  public sum(selector?: (item: T) => number): number {
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

  public max(selector?: (item: T) => number): T {
    if (!selector) {
      return this.aggregate((prev, curr) => {
        if (typeof curr !== 'number') {
          throw new Error('sum can only be used with numbers');
        }

        return prev > curr ? prev : curr;
      });
    }

    return this.aggregate((prev, curr) => (selector(prev) > selector(curr) ? prev : curr));
  }

  public min(selector?: (item: T) => number): T {
    if (!selector) {
      return this.aggregate((prev, curr) => {
        if (typeof curr !== 'number') {
          throw new Error('sum can only be used with numbers');
        }

        return prev < curr ? prev : curr;
      });
    }

    return this.aggregate((prev, curr) => (selector(prev) < selector(curr) ? prev : curr));
  }

  public average(selector?: (item: T) => number): number {
    return this.sum(selector) / this.count();
  }

  public quantile(selector: (item: T) => number, q: number): number {
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

  public select<TDestination>(exp: (item: T, index: number) => TDestination): Enumerable<TDestination> {
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

  public selectMany<TDestination>(exp: (item: T, index: number) => TDestination[]): Enumerable<TDestination> {
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

  public toMap<TKey>(keySelector: (item: T) => TKey): Map<TKey, T> {
    const map = new Map<TKey, T>();

    for (const item of this.srcGenerator()) {
      const key = keySelector(item);
      map.set(key, item);
    }

    return map;
  }

  public toSet(): Set<T> {
    return new Set(this.srcGenerator());
  }

  public toArray(): T[] {
    return [...this.srcGenerator()];
  }

  public shuffle(): Enumerable<T> {
    const src = this.srcGenerator;

    function* generator(): Generator<T> {
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

  public groupBy<TKey>(keySelector: (item: T) => TKey): Enumerable<Grouping<TKey, T>> {
    const src = this.srcGenerator;

    function* generator(): Generator<Grouping<TKey, T>> {
      const map = new Map<TKey, T[]>();

      for (const item of src()) {
        const key = keySelector(item);
        const curr = map.get(key);

        if (curr) {
          curr.push(item);
        } else {
          map.set(key, [item]);
        }
      }

      for (const [key, value] of map) {
        yield new Grouping(key, value);
      }
    }

    return new Enumerable(generator);
  }

  public chunkBy(chunkSize: number): Enumerable<Enumerable<T>> {
    return this.select((x, i) => ({ index: i, value: x }))
      .groupBy(x => Math.floor(x.index / chunkSize))
      .select(x => x.select(v => v.value));
  }

  public distinct<TKey>(selector?: (item: T) => TKey): Enumerable<T> {
    const src = this.srcGenerator;

    function* generator(): Generator<T> {
      if (!selector) {
        const seenItems = new Set<T>();

        for (const item of src()) {
          if (!seenItems.has(item)) {
            seenItems.add(item);
            yield item;
          }
        }
      } else {
        const seenKeys = new Set<TKey>();

        for (const item of src()) {
          const key = selector(item);

          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            yield item;
          }
        }
      }
    }

    return new Enumerable(generator);
  }
}

export class Grouping<TKey, TElement> extends Enumerable<TElement> {
  public readonly key: TKey;

  public constructor(key: TKey, src: Iterable<TElement>) {
    super(src);
    this.key = key;
  }
}
