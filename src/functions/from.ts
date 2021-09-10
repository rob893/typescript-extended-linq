import { Enumerable } from '../Enumerable';
import { getIterableGenerator } from './shared/getIterableGenerator';

export function from<TSource>(src: Iterable<TSource>): Enumerable<TSource>;

export function from<TSource>(src: TSource): Enumerable<[keyof TSource, TSource[keyof TSource]]>;

export function from<TSource>(
  src: Iterable<TSource> | TSource
): Enumerable<TSource | [keyof TSource, TSource[keyof TSource]]> {
  if (src instanceof Enumerable) {
    return src;
  }

  if (typeof (src as Iterable<TSource>)[Symbol.iterator] === 'function') {
    return new Enumerable(getIterableGenerator(src as Iterable<TSource>));
  }

  if (typeof src === 'object') {
    const generator = function* (): Generator<[keyof TSource, TSource[keyof TSource]]> {
      for (const entry of Object.entries(src)) {
        yield entry as [keyof TSource, TSource[keyof TSource]];
      }
    };

    return new Enumerable(generator);
  }

  throw new Error('Cannot create Enumerable from src.');
}
