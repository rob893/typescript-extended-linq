import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';
import { getKeySelectorAndComparer } from '../../utilities/utilityFunctions';

export function applyXor<TSource, TKey>(
  factory: IEnumerableFactory,
  overrideKeySelector: ((item: TSource) => TKey) | null,
  src: Iterable<TSource>,
  second: (Iterable<TSource> | ((item: TSource) => TKey) | EqualityComparer<TKey>)[]
): IEnumerable<TSource> {
  function* generator(): Generator<TSource> {
    const [others, keySelector, equalityComparer] = getKeySelectorAndComparer(overrideKeySelector, second);

    const setPairs: [Iterable<TSource>, Set<TKey>][] = [
      [src, new Set([...src].map(keySelector))],
      ...others.map((other): [Iterable<TSource>, Set<TKey>] => [other, new Set([...other].map(keySelector))])
    ];

    const seenKeys = new Set<TKey>();

    for (const pair of setPairs) {
      const [source] = pair;

      for (const item of source) {
        const key = keySelector(item);

        if (seenKeys.has(key)) {
          continue;
        }

        seenKeys.add(key);
        let returnItem = true;

        for (const otherPair of setPairs) {
          if (pair === otherPair) {
            continue;
          }

          const [_, otherKeys] = otherPair;

          if (equalityComparer) {
            for (const otherKey of otherKeys) {
              if (equalityComparer(key, otherKey)) {
                returnItem = false;
                break;
              }
            }
          } else {
            if (otherKeys.has(key)) {
              returnItem = false;
              break;
            }
          }
        }

        if (returnItem) {
          yield item;
        }
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}
