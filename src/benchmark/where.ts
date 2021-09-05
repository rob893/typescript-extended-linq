import { Suite } from 'benchmark';
import { List } from 'linq-typescript';
import { from as fromLTT } from 'linq-to-typescript';
import { from } from '../index';
import { EagerLoad, getTestObjects } from './benchmarkHelpers';

export function whereBenchmark(): void {
  const suite = new Suite();

  const objects = getTestObjects();

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

  suite.add('where (eager)', () => {
    const res = objEnumerableEager.where(x => x.id % 2 === 0);

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

  suite
    .on('cycle', (event: any) => {
      console.log(String(event.target));
      if (event.target.error) {
        console.error(event.target.error);
      }
    })
    .run();
}
