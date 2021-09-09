import { TypeOfMember } from '../types';
import { Enumerable } from '../Enumerable';

export function ofType<TSource, TResult>(
  src: Iterable<TSource>,
  type: new (...params: unknown[]) => TResult
): Enumerable<TResult>;
export function ofType<TSource, TResult>(src: Iterable<TSource>, type: TypeOfMember): Enumerable<TResult>;
export function ofType<TSource, TResult>(
  src: Iterable<TSource>,
  type: (new (...params: unknown[]) => TResult) | TypeOfMember
): Enumerable<TResult | TSource> {
  function* generator(): Generator<TResult | TSource> {
    for (const item of src) {
      if (typeof type === 'string') {
        if (typeof item === type) {
          yield item;
        }
      } else {
        if (item instanceof type) {
          yield item;
        }
      }
    }
  }

  return new Enumerable(generator);
}
