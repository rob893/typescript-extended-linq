import { IEnumerable, IEnumerableFactory } from '../../types';
import { isEnumerable } from '../isEnumerable';
import { getIterableGenerator } from '../../utilities/utilityFunctions';

export function applyFrom<TSource>(factory: IEnumerableFactory, src: Iterable<TSource>): IEnumerable<TSource>;

export function applyFrom<TSource>(
  factory: IEnumerableFactory,
  src: TSource
): IEnumerable<[keyof TSource, TSource[keyof TSource]]>;

export function applyFrom<TSource>(
  factory: IEnumerableFactory,
  src: Iterable<TSource> | TSource
): IEnumerable<TSource | [keyof TSource, TSource[keyof TSource]]> {
  if (isEnumerable(src)) {
    return src as IEnumerable<TSource>;
  }

  if (Array.isArray(src)) {
    return factory.createArrayEnumerable(getIterableGenerator(src), src);
  }

  if (typeof (src as Iterable<TSource>)[Symbol.iterator] === 'function') {
    return factory.createBasicEnumerable(getIterableGenerator(src as Iterable<TSource>));
  }

  if (typeof src === 'object') {
    const generator = function* (): Generator<[keyof TSource, TSource[keyof TSource]]> {
      for (const entry of Object.entries(src as object)) {
        yield entry as [keyof TSource, TSource[keyof TSource]];
      }
    };

    return factory.createBasicEnumerable(generator);
  }

  throw new Error('Cannot create Enumerable from src.');
}
