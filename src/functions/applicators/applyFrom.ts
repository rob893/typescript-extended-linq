import { IEnumerable, IEnumerableConstructor } from '../../types';
import { getIterableGenerator } from '../shared/getIterableGenerator';

export function applyFrom<TSource>(
  enumerableCtor: IEnumerableConstructor<TSource>,
  arrayEnumerableCtor: new (generator: () => Generator<TSource>, srcArr: TSource[]) => IEnumerable<TSource>,
  src: Iterable<TSource>
): IEnumerable<TSource>;

export function applyFrom<TSource>(
  enumerableCtor: IEnumerableConstructor<[keyof TSource, TSource[keyof TSource]]>,
  arrayEnumerableCtor: new (generator: () => Generator<TSource>, srcArr: TSource[]) => IEnumerable<TSource>,
  src: TSource
): IEnumerable<[keyof TSource, TSource[keyof TSource]]>;

export function applyFrom<TSource>(
  enumerableCtor: IEnumerableConstructor<TSource | [keyof TSource, TSource[keyof TSource]]>,
  arrayEnumerableCtor: new (generator: () => Generator<TSource>, srcArr: TSource[]) => IEnumerable<TSource>,
  src: Iterable<TSource> | TSource
): IEnumerable<TSource | [keyof TSource, TSource[keyof TSource]]> {
  if (src instanceof enumerableCtor) {
    return src;
  }

  if (Array.isArray(src)) {
    return new arrayEnumerableCtor(getIterableGenerator(src), src);
  }

  if (typeof (src as Iterable<TSource>)[Symbol.iterator] === 'function') {
    return new enumerableCtor(getIterableGenerator(src as Iterable<TSource>));
  }

  if (typeof src === 'object') {
    const generator = function* (): Generator<[keyof TSource, TSource[keyof TSource]]> {
      for (const entry of Object.entries(src)) {
        yield entry as [keyof TSource, TSource[keyof TSource]];
      }
    };

    return new enumerableCtor(generator);
  }

  throw new Error('Cannot create Enumerable from src.');
}
