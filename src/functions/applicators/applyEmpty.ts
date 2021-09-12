import { IEnumerable, IEnumerableConstructor } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applyEmpty<TSource>(enumerableType: IEnumerableConstructor<TSource>): IEnumerable<TSource> {
  return new enumerableType(getIterableGenerator([]));
}
