import { Suite } from 'benchmark';
import { from } from '../index';

export function xorBenchmark(): void {
  const suite = new Suite();

  suite.add('xor', () => {
    for (const _ of from([1, 2, 3]).xor([2, 3, 4], [3, 4, 5], [], [6])) {
      // placeholder
    }
  });

  suite.add('xorBy', () => {
    const items = [
      { id: 1, foo: 'asdf' },
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' }
    ];

    const otherItems = [
      { id: 2, foo: 'asdf' },
      { id: 3, foo: 'asdf' },
      { id: 4, foo: 'asdf' }
    ];

    for (const _ of from(items).xorBy(otherItems, x => x.id)) {
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
