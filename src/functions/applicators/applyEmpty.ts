import { IEnumerable, IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applyEmpty<TSource>(factory: IEnumerableFactory): IEnumerable<TSource> {
  return factory.createEnumerable(getIterableGenerator([]));
}
