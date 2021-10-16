import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';
import { getKeySelectorAndComparer } from '../../utilities/utilityFunctions';

export function applyUnion<TSource, TKey>(
  factory: IEnumerableFactory,
  overrideKeySelector: ((item: TSource) => TKey) | null,
  src: Iterable<TSource>,
  second: (Iterable<TSource> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const [others, keySelector, equalityComparer] = getKeySelectorAndComparer(overrideKeySelector, second);

    if (equalityComparer) {
      const seenKeys: TKey[] = [];

      for (const source of [src, ...others]) {
        for (const item of source) {
          const key = keySelector(item);
          let returnItem = true;

          for (let i = 0; i < seenKeys.length; i++) {
            if (equalityComparer(key, seenKeys[i])) {
              returnItem = false;
              break;
            }
          }

          if (returnItem) {
            seenKeys.push(key);
            yield item;
          }
        }
      }
    } else {
      const seenKeys = new Set<TKey>();

      for (const source of [src, ...others]) {
        for (const item of source) {
          const key = keySelector(item);

          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            yield item;
          }
        }
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}
