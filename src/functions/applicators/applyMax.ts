import { IEnumerableConstructor } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applyMax<TSource, TKey, TResult>(
  enumerableType: IEnumerableConstructor<TSource>,
  src: Iterable<TSource>,
  keySelector: (item: TSource) => TKey,
  selector?: (item: TSource) => TResult
): TSource | TResult {
  if (!selector) {
    return new enumerableType(getIterableGenerator(src)).aggregate((prev, curr) =>
      keySelector(prev) >= keySelector(curr) ? prev : curr
    );
  }

  return new enumerableType(getIterableGenerator(src))
    .select(selector)
    .aggregate((prev, curr) => (prev >= curr ? prev : curr));
}
