import { EqualityComparer, IEnumerable, IEnumerableFactory, IGrouping } from '../../types';
import { getIterableGenerator, toKeyMap } from '../../utilities/utilityFunctions';

export function applyGroupBy<TSource, TKey>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<IGrouping<TKey, TSource>> {
  function* generator(): Generator<IGrouping<TKey, TSource>> {
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
        yield factory.createGroupedEnumerable(groupKey, getIterableGenerator(group));
      }
    } else {
      for (const [groupKey, group] of toKeyMap(src, keySelector)) {
        yield factory.createGroupedEnumerable(groupKey, getIterableGenerator(group));
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}
