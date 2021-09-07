import { Enumerable } from '../Enumerable';

export function repeat<TResult>(element: TResult, count: number): Enumerable<TResult> {
  if (count < 0) {
    throw new Error('Count must be greater than or equal to 0');
  }

  function* generator(): Generator<TResult> {
    for (let i = 0; i < count; i++) {
      yield element;
    }
  }

  return new Enumerable(generator);
}
