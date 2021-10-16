import { IEnumerable, IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../../utilities/utilityFunctions';

export function applyAsEnumerable<TSource>(factory: IEnumerableFactory, src: Iterable<TSource>): IEnumerable<TSource> {
  return factory.createBasicEnumerable(getIterableGenerator(src));
}
