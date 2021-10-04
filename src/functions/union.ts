import { EnumerableFactory } from '../utilities/EnumerableFactory';
import { IEnumerable } from '../types';
import { EqualityComparer } from '../types';
import { applyUnion } from './applicators/applyUnion';

export function union<TSource>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  equalityComparer?: EqualityComparer<TSource>
): IEnumerable<TSource> {
  return applyUnion(new EnumerableFactory(), (x: TSource) => x, equalityComparer, src, second);
}

export function unionBy<TSource, TKey>(
  src: Iterable<TSource>,
  second: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<TSource> {
  return applyUnion<TSource, TKey>(new EnumerableFactory(), keySelector, equalityComparer, src, second);
}
