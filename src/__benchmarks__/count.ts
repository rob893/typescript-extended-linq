import { Suite } from 'benchmark';
import { List } from 'linq-typescript';
import { from as fromLTT } from 'linq-to-typescript';
import { from } from '../index';
import { getTestObjects, TestType } from './benchmarkHelpers';

export function countBenchmark(): void {
  const suite = new Suite();

  const objects = getTestObjects();

  const objEnumerable = from(objects);
  const objEnumerableLTT = fromLTT(objects);
  const objList = new List(objects);

  const exp = (x: TestType): boolean => x.id % 2 === 0;

  suite.add('count', () => {
    const _ = objEnumerable.count();
  });

  suite.add('count (exp)', () => {
    const _ = objEnumerable.count(exp);
  });

  suite.add('count  (linq-typescript)', () => {
    const _ = objList.count();
  });

  suite.add('count (exp) (linq-typescript)', () => {
    const _ = objList.count(exp);
  });

  suite.add('count (linq-to-typescript)', () => {
    const _ = objEnumerableLTT.count();
  });

  suite.add('count (exp) (linq-to-typescript)', () => {
    const _ = objEnumerableLTT.count(exp);
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
