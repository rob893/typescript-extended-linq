import { IEnumerable, IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applySplit<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  separator: TSource
): IEnumerable<IEnumerable<TSource>> {
  function* generator(): Generator<IEnumerable<TSource>> {
    let chunk: TSource[] = [];

    for (const item of src) {
      if (item === separator) {
        yield factory.createArrayEnumerable(getIterableGenerator(chunk), chunk);
        chunk = [];
      } else {
        chunk.push(item);
      }
    }

    if (chunk.length > 0) {
      yield factory.createArrayEnumerable(getIterableGenerator(chunk), chunk);
    }
  }

  return factory.createBasicEnumerable(generator);
}
