import { IEnumerable, IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../../utilities/utilityFunctions';

export function applyEmpty<TSource>(factory: IEnumerableFactory): IEnumerable<TSource> {
  return factory.createBasicEnumerable(getIterableGenerator([]));
}
