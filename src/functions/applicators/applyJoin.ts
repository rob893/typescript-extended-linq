import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';

export function applyJoin<TOuter, TInner, TKey, TResult>(
  factory: IEnumerableFactory,
  outer: Iterable<TOuter>,
  inner: Iterable<TInner>,
  outerKeySelector: (item: TOuter) => TKey,
  innerKeySelector: (item: TInner) => TKey,
  resultSelector: (item: TOuter, inner: TInner) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TResult> {
  function* generator(): Generator<TResult> {
    if (equalityComparer) {
      for (const outerItem of outer) {
        const outerKey = outerKeySelector(outerItem);

        for (const innerItem of inner) {
          if (equalityComparer(outerKey, innerKeySelector(innerItem))) {
            yield resultSelector(outerItem, innerItem);
          }
        }
      }
    } else {
      const innerMap = new Map<TKey, TInner[]>();

      for (const innerItem of inner) {
        const key = innerKeySelector(innerItem);
        const curr = innerMap.get(key);

        if (curr !== undefined) {
          curr.push(innerItem);
        } else {
          innerMap.set(key, [innerItem]);
        }
      }

      for (const outerItem of outer) {
        const key = outerKeySelector(outerItem);
        const innersToJoin = innerMap.get(key);

        if (innersToJoin !== undefined) {
          for (let i = 0; i < innersToJoin.length; i++) {
            yield resultSelector(outerItem, innersToJoin[i]);
          }
        }
      }
    }
  }

  return factory.createEnumerable(generator);
}
