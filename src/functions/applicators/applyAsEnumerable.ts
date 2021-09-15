import { IEnumerable, IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applyAsEnumerable<TSource>(factory: IEnumerableFactory, src: Iterable<TSource>): IEnumerable<TSource> {
  return factory.createBasicEnumerable(getIterableGenerator(src));
}
