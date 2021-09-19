import { Suite } from 'benchmark';
import { List } from 'linq-typescript';
import { from as fromLTT } from 'linq-to-typescript';
import { from } from '../index';
import { getTestObjects, TestType } from './benchmarkHelpers';

export function selectBenchmark(): void {
  const suite = new Suite();

  const objects = getTestObjects();

  const objEnumerable = from(objects);
  const objEnumerableLTT = fromLTT(objects);
  const objList = new List(objects);

  const exp = (x: TestType): number => x.id;

  suite.add('select', () => {
    const items = objEnumerable.select(exp);

    for (const _ of items) {
      // placeholder
    }
  });

  suite.add('map (native js)', () => {
    const items = objects.map(exp);

    for (const _ of items) {
      // placeholder
    }
  });

  suite.add('select (linq-typescript)', () => {
    const items = objList.select(exp).toArray();

    for (const _ of items) {
      // placeholder
    }
  });

  suite.add('select (linq-to-typescript)', () => {
    const items = objEnumerableLTT.select(exp);

    for (const _ of items) {
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
