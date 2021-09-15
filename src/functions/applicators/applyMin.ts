import { IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applyMin<TSource, TKey, TResult>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  selector?: (item: TSource) => TResult
): TSource | TResult {
  if (!selector) {
    return factory
      .createBasicEnumerable(getIterableGenerator(src))
      .aggregate((prev, curr) => (keySelector(prev) <= keySelector(curr) ? prev : curr));
  }

  return factory
    .createBasicEnumerable(getIterableGenerator(src))
    .select(selector)
    .aggregate((prev, curr) => (prev <= curr ? prev : curr));
}
