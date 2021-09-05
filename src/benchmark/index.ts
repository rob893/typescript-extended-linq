import { Suite } from 'benchmark';
import { from } from '../index';

const suite = new Suite();

const numbers = [5, 7, 2, 4, 1, -1, 0];
const objects = [
  { id: 1, foo: 'sfoo', bar: [5] },
  { id: 3, foo: 'ffoo', bar: [] },
  { id: 2, foo: 'afoo', bar: [5, 5, 2] },
  { id: 4, foo: 'foo', bar: [5, 4, 3, 2, 1] }
];

const objEnumerable = from(objects);
const numsEnumberable = from(numbers);

suite.add('filter and map', () => {
  const res = objects.filter(x => x.id % 2 === 0).map(x => x.foo);
  for (const _ of res) {
    // placeholder
  }
});

suite.add('where and select', () => {
  const res = objEnumerable.where(x => x.id % 2 === 0).select(x => x.foo);

  for (const _ of res) {
    // placeholder
  }
});

suite.add('reduce', () => {
  const _ = numbers.reduce((prev, curr) => prev + curr);
});

suite.add('aggregate', () => {
  const _ = numsEnumberable.aggregate<number>((prev, curr) => prev + curr);
});

suite.add('find', () => {
  const _ = objects.find(x => x.id === 2);
});

suite.add('first', () => {
  const _ = objEnumerable.first(x => x.id === 2);
});

suite
  .on('cycle', (event: any) => {
    console.log(String(event.target));
    if (event.target.error) {
      console.error(event.target.error);
    }
  })
  .run();
