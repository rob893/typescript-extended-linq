import { Suite } from 'benchmark';
import { Queue } from '../index';
import { getTestObjects, TestType } from './benchmarkHelpers';

export function queueBenchmark(): void {
  const suite = new Suite();

  const objects = getTestObjects(10000);

  suite.add('enqueue', () => {
    const queue = new Queue<TestType>();

    for (let i = 0; i < objects.length; i++) {
      queue.enqueue(objects[i]);
    }
  });

  suite.add('push (native array)', () => {
    const arr = [];

    for (let i = 0; i < objects.length; i++) {
      arr.push(objects[i]);
    }
  });

  suite.add('dequeue', () => {
    const queue = new Queue<TestType>(objects);

    for (let i = 0; i < objects.length; i++) {
      const _ = queue.dequeue();
    }
  });

  suite.add('shift (native array)', () => {
    const arr = [...objects];

    for (let i = 0; i < objects.length; i++) {
      const _ = arr.shift();
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
