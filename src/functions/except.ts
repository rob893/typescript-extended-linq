import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyExcept } from './applicators/applyExcept';

export function except<TSource>(
  src: Iterable<TSource>,
  ...second: (Iterable<TSource> | EqualityComparer<TSource>)[]
): IEnumerable<TSource> {
  return applyExcept(new EnumerableFactory(), x => x, src, ...second);
}

export function exceptBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TKey>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  const items = equalityComparer ? [second, equalityComparer] : [second];
  return applyExcept(new EnumerableFactory(), keySelector, src, ...items);
}
