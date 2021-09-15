import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';

export function applyExcept<TSource, TKey>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const secondKeySet: Set<TKey> = second instanceof Set ? second : new Set(second);

    if (equalityComparer) {
      for (const item of src) {
        const key = keySelector(item);
        let returnItem = true;

        for (const secondItemKey of secondKeySet) {
          if (equalityComparer(key, secondItemKey)) {
            returnItem = false;
            break;
          }
        }

        if (returnItem) {
          secondKeySet.add(key);
          yield item;
        }
      }
    } else {
      for (const item of src) {
        const key = keySelector(item);

        if (!secondKeySet.has(key)) {
          secondKeySet.add(key);
          yield item;
        }
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}
