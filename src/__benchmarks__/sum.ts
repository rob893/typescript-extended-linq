import { Suite } from 'benchmark';
import { List } from 'linq-typescript';
import { from as fromLTT } from 'linq-to-typescript';
import { from } from '../index';
import { getTestObjects, TestType } from './benchmarkHelpers';

export function sumBenchmark(): void {
  const suite = new Suite();

  const objects = getTestObjects();

  const objEnumerable = from(objects);
  const objEnumerableLTT = fromLTT(objects);
  const objList = new List(objects);

  const exp = (x: TestType): number => x.id;

  suite.add('sum', () => {
    const _ = objEnumerable.sum(exp);
  });

  suite.add('sum (linq-typescript)', () => {
    const _ = objList.sum(exp);
  });

  suite.add('sum (linq-to-typescript)', () => {
    const _ = objEnumerableLTT.sum(exp);
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
