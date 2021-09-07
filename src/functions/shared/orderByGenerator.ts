import { Comparer } from '../../types';
import { toKeyMap } from './toKeyMap';

export function* orderByGenerator<TSource, TKey>(
  src: Iterable<TSource>,
  ascending: boolean,
  selector: (item: TSource) => TKey,
  comparer?: Comparer<TKey>
): Generator<TSource[]> {
  const map = toKeyMap(src, selector);
  const sortedKeys = [...map.keys()].sort((a, b) => {
    if (comparer) {
      return comparer(a, b);
    }

    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    } else {
      return 0;
    }
  });

  if (ascending) {
    for (let i = 0; i < sortedKeys.length; i++) {
      const items = map.get(sortedKeys[i]);
      yield items ?? [];
    }
  } else {
    for (let i = sortedKeys.length - 1; i >= 0; i--) {
      const items = map.get(sortedKeys[i]);
      yield items ?? [];
    }
  }
}
