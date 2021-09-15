import { EnumerableFactory } from '../EnumerableFactory';
import { IEnumerable } from '../types';
import { IGrouping } from '../types';
import { EqualityComparer } from '../types';
import { applyGroupBy } from './applicators/applyGroupBy';

export function groupBy<TSource, TKey>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<IGrouping<TKey, TSource>> {
  const factory = new EnumerableFactory();
  return applyGroupBy(
    factory,
    (key, groupGenerator) => factory.createGroupedEnumerable(key, groupGenerator),
    src,
    keySelector,
    equalityComparer
  );
}
