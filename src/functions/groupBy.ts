import { Enumerable, Grouping } from '../Enumerable';
import { EqualityComparer } from '../types';
import { toKeyMap } from './shared/toKeyMap';

export function groupBy<TSource, TKey>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): Enumerable<Grouping<TKey, TSource>> {
  function* generator(): Generator<Grouping<TKey, TSource>> {
    if (equalityComparer) {
      const groupings: [TKey, TSource[]][] = [];

      for (const item of src) {
        const key = keySelector(item);
        let groupExists = false;

        for (let i = 0; i < groupings.length; i++) {
          const [groupKey, group] = groupings[i];

          if (equalityComparer(key, groupKey)) {
            groupExists = true;
            group.push(item);
          }
        }

        if (!groupExists) {
          groupings.push([key, [item]]);
        }
      }

      for (let i = 0; i < groupings.length; i++) {
        const [groupKey, group] = groupings[i];
        yield new Grouping(groupKey, group);
      }
    } else {
      for (const [key, value] of toKeyMap(src, keySelector)) {
        yield new Grouping(key, value);
      }
    }
  }

  return new Enumerable(generator);
}
