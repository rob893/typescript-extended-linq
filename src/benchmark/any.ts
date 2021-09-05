import { Suite } from 'benchmark';
import { List } from 'linq-typescript';
import { from as fromLTT } from 'linq-to-typescript';
import { from } from '../index';

interface TestType {
  id: number;
  foo: string;
  bar: number[];
}

const suite = new Suite();

const objects: TestType[] = [];

for (let i = 0; i < 250000; i++) {
  objects.push({ id: i, foo: `${i}foo`, bar: [1, 2, 3] });
}

const objEnumerable = from(objects);
const objEnumerableLTT = fromLTT(objects);
const objList = new List(objects);

const exp = (x: TestType): boolean => x.id === 100000;

suite.add('any', () => {
  const _ = objEnumerable.any(exp);
});

suite.add('some (native js)', () => {
  const _ = objects.some(exp);
});

suite.add('any (linq-typescript)', () => {
  const _ = objList.any(exp);
});

suite.add('any (linq-to-typescript)', () => {
  const _ = objEnumerableLTT.any(exp);
});

suite
  .on('cycle', (event: any) => {
    console.log(String(event.target));
    if (event.target.error) {
      console.error(event.target.error);
    }
  })
  .run();
