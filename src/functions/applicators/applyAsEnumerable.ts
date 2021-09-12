import { IEnumerable, IEnumerableConstructor } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applyAsEnumerable<TSource>(
  enumerableType: IEnumerableConstructor<TSource>,
  src: Iterable<TSource>
): IEnumerable<TSource> {
  return new enumerableType(getIterableGenerator(src));
}
