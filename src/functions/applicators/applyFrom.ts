import { IEnumerable, IEnumerableConstructor } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applyFrom<TSource>(
  enumerableType: IEnumerableConstructor<TSource | [keyof TSource, TSource[keyof TSource]]>,
  src: Iterable<TSource> | TSource
): IEnumerable<TSource | [keyof TSource, TSource[keyof TSource]]> {
  if (src instanceof enumerableType) {
    return src;
  }

  if (typeof (src as Iterable<TSource>)[Symbol.iterator] === 'function') {
    return new enumerableType(getIterableGenerator(src as Iterable<TSource>));
  }

  if (typeof src === 'object') {
    const generator = function* (): Generator<[keyof TSource, TSource[keyof TSource]]> {
      for (const entry of Object.entries(src)) {
        yield entry as [keyof TSource, TSource[keyof TSource]];
      }
    };

    return new enumerableType(generator);
  }

  throw new Error('Cannot create Enumerable from src.');
}
