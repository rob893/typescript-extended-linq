import { IEnumerable, IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applySplit<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  separatorOrPredicate: TSource | ((item: TSource, index: number) => boolean)
): IEnumerable<IEnumerable<TSource>> {
  function* generator(): Generator<IEnumerable<TSource>> {
    let chunk: TSource[] = [];
    let i = 0;

    for (const item of src) {
      if (
        (typeof separatorOrPredicate === 'function' &&
          (separatorOrPredicate as (item: TSource, index: number) => boolean)(item, i)) ||
        (typeof separatorOrPredicate !== 'function' && item === separatorOrPredicate)
      ) {
        yield factory.createArrayEnumerable(getIterableGenerator(chunk), chunk);
        chunk = [];
      } else {
        chunk.push(item);
      }

      i++;
    }

    if (chunk.length > 0) {
      yield factory.createArrayEnumerable(getIterableGenerator(chunk), chunk);
    }
  }

  return factory.createBasicEnumerable(generator);
}
