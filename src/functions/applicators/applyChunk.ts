import { IEnumerable, IEnumerableFactory } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applyChunk<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource>,
  chunkSize: number
): IEnumerable<IEnumerable<TSource>> {
  if (chunkSize <= 0) {
    throw new Error('chunkSize must be greater than 0');
  }

  function* generator(): Generator<IEnumerable<TSource>> {
    let chunk: TSource[] = [];

    for (const item of src) {
      chunk.push(item);

      if (chunk.length >= chunkSize) {
        yield factory.createArrayEnumerable(getIterableGenerator(chunk), chunk);
        chunk = [];
      }
    }

    if (chunk.length > 0) {
      yield factory.createArrayEnumerable(getIterableGenerator(chunk), chunk);
    }
  }

  return factory.createBasicEnumerable(generator);
}
