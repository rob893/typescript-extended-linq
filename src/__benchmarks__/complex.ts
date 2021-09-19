import { Suite } from 'benchmark';
import { List } from 'linq-typescript';
import { from as fromLTT } from 'linq-to-typescript';
import { from } from '../index';
import { EagerLoad, getTestObjects } from './benchmarkHelpers';

export function complexBenchmark(): void {
  const suite = new Suite();

  const objects = getTestObjects();

  const objEnumerable = from(objects);
  const objEnumerableEager = from(new EagerLoad(objects));
  const objEnumerableLTT = fromLTT(objects);
  const objList = new List(objects);

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
}
