import { Suite } from 'benchmark';
import { List } from 'linq-typescript';
import { from as fromLTT } from 'linq-to-typescript';
import { from } from '../index';

const suite = new Suite();

const objects = [
  { id: 1, foo: 'sfoo', bar: [5] },
  { id: 3, foo: 'ffoo', bar: [] },
  { id: 2, foo: 'afoo', bar: [5, 5, 2] },
  { id: 4, foo: 'foo', bar: [5, 4, 3, 2, 1] }
];

for (let i = 0; i < 250000; i++) {
  objects.push({ id: i, foo: `${i}foo`, bar: [1, 2, 3] });
}

class EagerLoad<T> implements Iterable<T> {
  private readonly src: Iterable<T>;

  public constructor(src: Iterable<T>) {
    this.src = src;
  }

  public *[Symbol.iterator](): Generator<T> {
    for (const item of this.src) {
      yield item;
    }
  }

  public where(exp: (item: T, index: number) => boolean): EagerLoad<T> {
    const filtered = [];

    let i = 0;
    for (const item of this.src) {
      if (exp(item, i)) {
        filtered.push(item);
      }
      i++;
    }

    return new EagerLoad(filtered);
  }

  public select<TDestination>(exp: (item: T, index: number) => TDestination): EagerLoad<TDestination> {
    const mapped = [];

    let i = 0;
    for (const item of this.src) {
      mapped.push(exp(item, i));
      i++;
    }

    return new EagerLoad(mapped);
  }

  public selectMany<TDestination>(exp: (item: T, index: number) => TDestination[]): EagerLoad<TDestination> {
    const mapped = [];

    let i = 0;
    for (const item of this.src) {
      for (const subItem of exp(item, i)) {
        mapped.push(subItem);
      }
      i++;
    }

    return new EagerLoad(mapped);
  }
}

const objEnumerable = from(objects);
const objEnumerableEager = from(new EagerLoad(objects));
const objEnumerableLTT = fromLTT(objects);
const objList = new List(objects);

suite.add('where', () => {
  const res = objEnumerable.where(x => x.id % 2 === 0);

  for (const _ of res) {
    // placeholder
  }
});

suite.add('where complex', () => {
  const res = objEnumerable
    .where(x => x.id % 2 === 0)
    .select(x => ({ bar: x.bar, foo: x.id * 2 }))
    .where(x => x.foo % 2 === 0)
    .selectMany(x => x.bar);

  for (const _ of res) {
    // placeholder
  }
});

suite.add('where (eager)', () => {
  const res = objEnumerableEager.where(x => x.id % 2 === 0);

  for (const _ of res) {
    // placeholder
  }
});

suite.add('where complex (eager)', () => {
  const res = objEnumerableEager
    .where(x => x.id % 2 === 0)
    .select(x => ({ bar: x.bar, foo: x.id * 2 }))
    .where(x => x.foo % 2 === 0)
    .selectMany(x => x.bar);

  for (const _ of res) {
    // placeholder
  }
});

suite.add('filter (native js)', () => {
  const res = objects.filter(x => x.id % 2 === 0);
  for (const _ of res) {
    // placeholder
  }
});

suite.add('filter complex', () => {
  const res = objects
    .filter(x => x.id % 2 === 0)
    .map(x => ({ bar: x.bar, foo: x.id * 2 }))
    .filter(x => x.foo % 2 === 1)
    .flatMap(x => x.bar);

  for (const _ of res) {
    // placeholder
  }
});

suite.add('where (linq-typescript)', () => {
  const res = objList.where(x => x.id % 2 === 0).toArray();

  for (const _ of res) {
    // placeholder
  }
});

suite.add('where complex (linq-typescript)', () => {
  const res = objList
    .where(x => x.id % 2 === 0)
    .select(x => ({ bar: x.bar, foo: x.id * 2 }))
    .where(x => x.foo % 2 === 0)
    .selectMany(x => x.bar)
    .toArray();

  for (const _ of res) {
    // placeholder
  }
});

suite.add('where (linq-to-typescript)', () => {
  const res = objEnumerableLTT.where(x => x.id % 2 === 0);

  for (const _ of res) {
    // placeholder
  }
});

suite.add('where complex (linq-to-typescript)', () => {
  const res = objEnumerableLTT
    .where(x => x.id % 2 === 0)
    .select(x => ({ bar: x.bar, foo: x.id * 2 }))
    .where(x => x.foo % 2 === 0)
    .selectMany(x => x.bar);

  for (const _ of res) {
    // placeholder
  }
});

suite.add('where select', () => {
  const res = objEnumerable.where(x => x.id % 2 === 0).select(x => x.foo);

  for (const _ of res) {
    // placeholder
  }
});

suite.add('where select (eager)', () => {
  const res = objEnumerableEager.where(x => x.id % 2 === 0).select(x => x.foo);

  for (const _ of res) {
    // placeholder
  }
});

suite.add('filter map (native js)', () => {
  const res = objects.filter(x => x.id % 2 === 0).map(x => x.foo);
  for (const _ of res) {
    // placeholder
  }
});

suite.add('where select (linq-typescript)', () => {
  const res = objList
    .where(x => x.id % 2 === 0)
    .select(x => x.foo)
    .toArray();

  for (const _ of res) {
    // placeholder
  }
});

suite.add('where select (linq-to-typescript)', () => {
  const res = objEnumerableLTT.where(x => x.id % 2 === 0).select(x => x.foo);

  for (const _ of res) {
    // placeholder
  }
});

suite
  .on('cycle', (event: any) => {
    console.log(String(event.target));
    if (event.target.error) {
      console.error(event.target.error);
    }
  })
  .run();
