import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';
import { getKeySelectorAndComparer } from '../../utilities/utilityFunctions';

export function applyExcept<TSource, TKey>(
  factory: IEnumerableFactory,
  overrideKeySelector: ((item: TSource) => TKey) | null,
  src: Iterable<TSource>,
  second: (Iterable<TKey> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const [others, keySelector, equalityComparer] = getKeySelectorAndComparer(overrideKeySelector, second);

    const secondKeySet: Set<TKey> = new Set(others.reduce((prev, curr) => [...prev, ...curr]));

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
