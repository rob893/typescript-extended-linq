import { Enumerable } from '../Enumerable';

export function ofType<TSource, TResult>(
  src: Iterable<TSource>,
  type: new (...params: unknown[]) => TResult
): Enumerable<TResult> {
  function* generator(): Generator<TResult> {
    for (const item of src) {
      if (item instanceof type) {
        yield item;
      }
    }
  }

  return new Enumerable(generator);
}
