import { IEnumerableConstructor, IEnumerable } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applyChunk<TSource>(
  enumerableType: IEnumerableConstructor<IEnumerable<TSource> | TSource>,
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
        yield new enumerableType(getIterableGenerator(chunk)) as IEnumerable<TSource>;
        chunk = [];
      }
    }

    if (chunk.length > 0) {
      yield new enumerableType(getIterableGenerator(chunk)) as IEnumerable<TSource>;
    }
  }

  return new enumerableType(generator) as IEnumerable<IEnumerable<TSource>>;
}
