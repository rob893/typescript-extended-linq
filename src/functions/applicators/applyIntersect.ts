import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';
import { getKeySelectorAndComparer } from '../../utilities/utilityFunctions';

export function applyIntersect<TSource, TKey>(
  factory: IEnumerableFactory,
  overrideKeySelector: ((item: TSource) => TKey) | null,
  src: Iterable<TSource>,
  second: (Iterable<TKey> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const [others, keySelector, equalityComparer] = getKeySelectorAndComparer(overrideKeySelector, second);

    const secondKeySets: Set<TKey>[] = others.map(s => (s instanceof Set ? s : new Set(s)));

    if (equalityComparer) {
      for (const item of src) {
        const key = keySelector(item);
        let returnItem = true;

        for (const secondKeySet of secondKeySets) {
          let toDeleteKey: TKey | null = null;
          let inSet = false;

          for (const secondItemKey of secondKeySet) {
            if (equalityComparer(key, secondItemKey)) {
              toDeleteKey = secondItemKey;
              inSet = true;
              break;
            }
          }

          if (toDeleteKey !== null) {
            secondKeySet.delete(toDeleteKey);
          }

          if (!inSet) {
            returnItem = false;
            break;
          }
        }

        if (returnItem) {
          yield item;
        }
      }
    } else {
      for (const item of src) {
        if (secondKeySets.every(s => s.delete(keySelector(item)))) {
          yield item;
        }
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}
