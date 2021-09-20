import { Suite } from 'benchmark';
import { List } from 'linq-typescript';
import { from as fromLTT } from 'linq-to-typescript';
import { from } from '../index';
import { getTestObjects, TestType } from './benchmarkHelpers';

export function allBenchmark(): void {
  const suite = new Suite();

  const objects = getTestObjects();

  const objEnumerable = from(objects);
  const objEnumerableLTT = fromLTT(objects);
  const objList = new List(objects);

  const trueExp = (x: TestType): boolean => typeof x.id === 'number';
  const falseExp = (x: TestType): boolean => x.id % 2 === 0;

  suite.add('all', () => {
    let _ = objEnumerable.all(trueExp);
    _ = objEnumerable.all(falseExp);
  });

  suite.add('every (native js)', () => {
    let _ = objects.every(trueExp);
    _ = objects.every(falseExp);
  });

  suite.add('all (linq-typescript)', () => {
    let _ = objList.all(trueExp);
    _ = objList.all(falseExp);
  });

  suite.add('all (linq-to-typescript)', () => {
    let _ = objEnumerableLTT.all(trueExp);
    _ = objEnumerableLTT.all(falseExp);
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
