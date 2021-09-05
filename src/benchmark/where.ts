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

const objEnumerable = from(objects);
const objEnumerableLTT = fromLTT(objects);
const objList = new List(objects);

suite.add('where', () => {
  const res = objEnumerable.where(x => x.id % 2 === 0);

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

suite.add('where (linq-typescript)', () => {
  const res = objList.where(x => x.id % 2 === 0).toArray();

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

suite.add('where select', () => {
  const res = objEnumerable.where(x => x.id % 2 === 0).select(x => x.foo);

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
