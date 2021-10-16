import { EqualityComparer, IEnumerable, IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../../utilities/utilityFunctions';

export function applyGroupJoin<TOuter, TInner, TKey, TResult>(
  factory: IEnumerableFactory,
  outer: Iterable<TOuter>,
  inner: Iterable<TInner>,
  outerKeySelector: (item: TOuter) => TKey,
  innerKeySelector: (item: TInner) => TKey,
  resultSelector: (item: TOuter, inner: IEnumerable<TInner>) => TResult,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TResult> {
  function* generator(): Generator<TResult> {
    if (equalityComparer) {
      for (const outerItem of outer) {
        const outerKey = outerKeySelector(outerItem);

        const inners = factory
          .createBasicEnumerable(getIterableGenerator(inner))
          .where(innerItem => equalityComparer(outerKey, innerKeySelector(innerItem)));
        yield resultSelector(outerItem, inners);
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

        yield resultSelector(outerItem, factory.createBasicEnumerable(getIterableGenerator(innersToJoin ?? [])));
      }
    }
  }

  return factory.createBasicEnumerable(generator);
}
