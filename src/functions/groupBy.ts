import { Enumerable, Grouping } from '../enumerables';
import { IEnumerable } from '../types';
import { IGrouping } from '../types';
import { EqualityComparer } from '../types';
import { applyGroupBy } from './applicators/applyGroupBy';

export function groupBy<TSource, TKey>(
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  equalityComparer?: EqualityComparer<TKey>
): IEnumerable<IGrouping<TKey, TSource>> {
  return applyGroupBy(
    Enumerable,
    (key, groupGenerator) => new Grouping(key, groupGenerator),
    src,
    keySelector,
    equalityComparer
  );
}
