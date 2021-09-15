import { IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applyMax<TSource, TKey, TResult>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  selector?: (item: TSource) => TResult
): TSource | TResult {
  if (!selector) {
    return factory
      .createEnumerable(getIterableGenerator(src))
      .aggregate((prev, curr) => (keySelector(prev) >= keySelector(curr) ? prev : curr));
  }

  return factory
    .createEnumerable(getIterableGenerator(src))
    .select(selector)
    .aggregate((prev, curr) => (prev >= curr ? prev : curr));
}
